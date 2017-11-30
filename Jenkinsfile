#!groovy
node {
  try {
    // Checkout the proper revision into the workspace.
    stage('checkout') {
      checkout scm
    }

    env.GIT_COMMIT = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()

    env.AWS_PROFILE = 'climate'
    env.CC_SETTINGS_BUCKET = 'staging-us-east-1-climate-lab-config'
    env.CC_SITE_BUCKET = 'staging-us-east-1-climate-lab-site'

    // set environment variables for staging or production; default to staging
    env.API_HOST = 'https://app.staging.climate.azavea.com';

    if (env.BRANCH_NAME == 'master') {
      env.API_HOST = 'https://app.climate.azavea.com';
      env.CC_SETTINGS_BUCKET = 'production-us-east-1-climate-lab-config'
      env.CC_SITE_BUCKET = 'production-us-east-1-climate-lab-site'
    }

    stage('setup') {
      wrap([$class: 'AnsiColorBuildWrapper']) {
        sh 'scripts/update'
      }
    }

    stage('test') {
      wrap([$class: 'AnsiColorBuildWrapper']) {
        writeFile file: 'src/app/constants.ts', text: """
            export const defaultCity = {\'id\': 7, \'properties\': {\'name\': \'Philadelphia\', \'admin\': \'PA\'}};
            export const apiHost = \'${env.API_HOST}\';
            export const defaultScenario = \'RCP85\';\n"""

        sh './scripts/test --jenkins'

        step([$class: 'WarningsPublisher',
          parserConfigurations: [[
            parserName: 'JSLint',
            pattern: 'jenkins/violations.xml'
          ]],
          // mark build unstable if there are any linter warnings
          unstableTotalAll: '0',
          usePreviousBuildAsReference: true
        ])
      }
    }

    stage('cibuild') {
      wrap([$class: 'AnsiColorBuildWrapper']) {
        sh './scripts/cibuild'
      }
    }

    // Publish to S3
    stage('infra') {
      if (env.BRANCH_NAME == 'develop' || env.BRANCH_NAME == 'master') {
          wrap([$class: 'AnsiColorBuildWrapper']) {
            sh 'docker-compose -f docker-compose.ci.yml run --rm terraform ./scripts/infra plan'
            sh 'docker-compose -f docker-compose.ci.yml run --rm terraform ./scripts/infra apply'
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
        sh 'docker-compose down -v'
      }
    }
  }
}
