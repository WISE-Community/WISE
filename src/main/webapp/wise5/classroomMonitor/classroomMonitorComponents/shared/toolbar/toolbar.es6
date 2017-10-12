"use strict";

class ToolbarController {
    constructor() {
        this.$onChanges = () => {
          this.showTitle = !this.showStepTools && !this.showTeamTools;
        }
    }

    toggleMenu() {
        this.onMenuToggle();
    }
}

ToolbarController.inject= [];

const Toolbar = {
    bindings: {
        numberProject: '<',
        showStepTools: '<',
        showTeamTools: '<',
        viewName: '<',
        workgroupId: '<',
        onMenuToggle: '&'
    },
    controller: ToolbarController,
    template:
        `<md-toolbar class="md-whiteframe-1dp layout-toolbar md-toolbar--wise" md-theme="light">
            <div class="md-toolbar-tools">
                <md-button aria-label="{{ 'mainMenu' | translate }}" class="md-icon-button" ng-click="$ctrl.toggleMenu()">
                    <md-icon> menu </md-icon>
                    <md-tooltip md-direction="bottom">{{ 'mainMenu' | translate }}</md-tooltip>
                </md-button>
                <span class="toolbar-title" ng-if="$ctrl.showTitle">{{ $ctrl.viewName }}</span>
                <step-tools ng-if="$ctrl.showStepTools" class="layout-tools" show-position="$ctrl.numberProject"></step-tools>
                <student-grading-tools ng-if="$ctrl.showTeamTools" workgroup-id="$ctrl.workgroupId" class="layout-tools"></student-grading-tools>
                <span flex></span>
                <period-select custom-class="'md-no-underline md-button toolbar__select'"></period-select>
            </div>
        </md-toolbar>`
};

export default Toolbar;
