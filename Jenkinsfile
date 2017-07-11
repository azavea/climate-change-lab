#!groovy
node {
  try {
    // Checkout the proper revision into the workspace.
    stage('checkout') {
      checkout scm
    }

    env.AWS_PROFILE = 'climate'
    env.GIT_COMMIT = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
    env.CLIMATE_CHANGE_LAB_PORT = 4422

    // set environment variables for staging or production; default to staging
    env.API_HOST = 'https://app.staging.climate.azavea.com';
    env.S3_WEBSITE_CONFIG_DIR = ".";
    env.CLOUDFRONT_ID_VAR = "CCLAB_AWS_STAGING_CLOUDFRONT_ID";

    if (env.BRANCH_NAME == 'master') {
      env.API_HOST = 'https://app.climate.azavea.com';
      env.S3_WEBSITE_CONFIG_DIR = "production_s3/";
      env.CLOUDFRONT_ID_VAR = "CCLAB_AWS_PRODUCTION_CLOUDFRONT_ID";
    }

    stage('setup') {
      wrap([$class: 'AnsiColorBuildWrapper']) {
        sh 'scripts/setup'
      }
    }

    stage('test') {
      wrap([$class: 'AnsiColorBuildWrapper']) {
        writeFile file: 'src/app/constants.ts', text: """
            export const defaultCity = {\'id\': 7, \'properties\': {\'name\': \'Philadelphia\', \'admin\': \'PA\'}};
            export const apiHost = \'${env.API_HOST}\';
            export const defaultScenario = \'RCP85\';\n"""

        sh 'vagrant ssh -c "/vagrant/scripts/test --jenkins"'

        step([$class: 'WarningsPublisher',
          parserConfigurations: [[
            parserName: 'JSLint',
            pattern: 'violations.xml'
          ]],
          // mark build unstable if there are any linter warnings
          unstableTotalAll: '0',
          usePreviousBuildAsReference: true
        ])
      }
    }

    stage('cibuild') {
      wrap([$class: 'AnsiColorBuildWrapper']) {
        sh 'vagrant ssh -c "/vagrant/scripts/cibuild"'
      }
    }

    // Publish to S3
    stage('publish') {
      if (env.BRANCH_NAME == 'develop' || env.BRANCH_NAME == 'master') {
        // Decode the credentials stored within Jenkins.
        withCredentials([[$class: 'StringBinding',
                          credentialsId: 'CCLAB_AWS_S3_ACCESS_KEY',
                          variable: 'CCLAB_AWS_S3_ACCESS_KEY'],
                          [$class: 'StringBinding',
                          credentialsId: 'CCLAB_AWS_S3_SECRET_ACCESS_KEY',
                          variable: 'CCLAB_AWS_S3_SECRET_ACCESS_KEY'],
                          [$class: 'StringBinding',
                          credentialsId: "${env.CLOUDFRONT_ID_VAR}",
                          variable: 'CCLAB_AWS_CLOUDFRONT_ID']]) {
          wrap([$class: 'AnsiColorBuildWrapper']) {
            writeFile file: '.env', text: """export CCLAB_AWS_S3_ACCESS_KEY="${env.CCLAB_AWS_S3_ACCESS_KEY}"\nexport CCLAB_AWS_S3_SECRET_ACCESS_KEY="${env.CCLAB_AWS_S3_SECRET_ACCESS_KEY}"\nexport CCLAB_AWS_CLOUDFRONT_ID="${env.CCLAB_AWS_CLOUDFRONT_ID}"\nexport S3_WEBSITE_CONFIG_DIR="${env.S3_WEBSITE_CONFIG_DIR}"\n"""
            sh 'vagrant ssh -c "/vagrant/scripts/cipublish"'
          }
        }
      }
    }

    // if got this far, build must not have failed
    def slackMessage = ":jenkins: *climate-change-lab (${env.BRANCH_NAME}) #${env.BUILD_NUMBER}*"
    if (env.CHANGE_TITLE) {
      slackMessage += "\n${env.CHANGE_TITLE} - ${env.CHANGE_AUTHOR}"
    }
    slackMessage += "\n<${env.BUILD_URL}|View Build>"
    slackSend color: 'good', channel: '#doe-climate-change', message: slackMessage

  } catch (err) {
    // Some exception was raised in the `try` block above. Assemble
    // an appropirate error message for Slack.

    def slackMessage = ":jenkins-angry: *climate-change-lab (${env.BRANCH_NAME}) #${env.BUILD_NUMBER}*"
    if (env.CHANGE_TITLE) {
      slackMessage += "\n${env.CHANGE_TITLE} - ${env.CHANGE_AUTHOR}"
    }
    slackMessage += "\n<${env.BUILD_URL}|View Build>"
    slackSend color: 'danger', channel: '#doe-climate-change', message: slackMessage

    // Re-raise the exception so that the failure is propagated to
    // Jenkins.
    throw err
  } finally {
    stage('cleanup') {
      wrap([$class: 'AnsiColorBuildWrapper']) {
        sh 'vagrant halt'
      }
    }
  }
}
