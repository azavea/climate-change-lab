/**
 * SpinKit animation component.
 * Derived from: https://github.com/WoltersKluwerPL/ng2-spin-kit
 * Modified to:
 * - remove module ID to fix error
 * - do not display loader if initially set to not display via `isRunning`
 *
 * Also included in project because it could not load directly from npm module,
 * due to dependency issues.
 */

import { Component, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'sk-wave',
  styles: [`
    .wave-spinner {
      margin: 25px auto;
      width: 42px;
      height: 40px;
    }

    .wave-spinner > div {
      display: inline-block;
      width: 5px;
      height: 100%;
      background-color: #333;

      -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
      animation: sk-stretchdelay 1.2s infinite ease-in-out;
    }

    .wave-spinner .rect2 {
      -webkit-animation-delay: -1.1s;
      animation-delay: -1.1s;
    }

    .wave-spinner .rect3 {
      -webkit-animation-delay: -1.0s;
      animation-delay: -1.0s;
    }

    .wave-spinner .rect4 {
      -webkit-animation-delay: -0.9s;
      animation-delay: -0.9s;
    }

    .wave-spinner .rect5 {
      -webkit-animation-delay: -0.8s;
      animation-delay: -0.8s;
    }

    @-webkit-keyframes sk-stretchdelay {
      0%, 40%, 100% {
        -webkit-transform: scaleY(0.4)
      }
      20% {
        -webkit-transform: scaleY(1.0)
      }
    }

    @keyframes sk-stretchdelay {
      0%, 40%, 100% {
        transform: scaleY(0.4);
        -webkit-transform: scaleY(0.4);
      }
      20% {
        transform: scaleY(1.0);
        -webkit-transform: scaleY(1.0);
      }
    }
  `],
  template: `
    <div [hidden]="!visible" class="wave-spinner">
      <div class="rect1"></div>
      <div class="rect2"></div>
      <div class="rect3"></div>
      <div class="rect4"></div>
      <div class="rect5"></div>
    </div>
  `
})

export class WaveComponent implements OnDestroy {

  @Input()
  public delay: number = 0;

  @Input()
  public set isRunning(value: boolean) {
    if (!value) {
      this.cancel();
      this.visible = false;
      return;
    }

    if (this.timeout) {
      return;
    }

    this.timeout = setTimeout(() => {
      this.visible = true;
      this.cancel();
    }, this.delay);
  }

  public visible: boolean = true;
  private timeout: any;

  ngOnDestroy(): any {
    this.cancel();
  }

  private cancel(): void {
    clearTimeout(this.timeout);
    this.timeout = undefined;
  }
}
