
class ComponentController {

    constructor($scope, $compile, $element, ConfigService, NodeService, NotebookService, ProjectService, StudentDataService) {
        this.$scope = $scope;
        this.$element = $element;
        this.$compile = $compile;
        this.ConfigService = ConfigService;
        this.NodeService = NodeService;
        this.NotebookService = NotebookService;
        this.ProjectService = ProjectService;
        this.StudentDataService = StudentDataService;
    }

    $onInit() {
        if (this.mode) {
            this.$scope.mode = this.mode;
        } else {
            this.$scope.mode = 'student';
        }

        if (this.workgroupId != null) {
            try {
                this.workgroupId = parseInt(this.workgroupId);
            } catch(e) {

            }
        }

        if (this.teacherWorkgroupId) {
            try {
                this.teacherWorkgroupId = parseInt(this.teacherWorkgroupId);
            } catch(e) {

            }
        }

        if (this.componentState == null || this.componentState === '') {
            this.componentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(this.nodeId, this.componentId);
        } else {
            this.componentState = angular.fromJson(this.componentState);
            this.nodeId = this.componentState.nodeId;
            this.componentId = this.componentState.componentId;
        }

        let authoringComponentContent;
        let componentContent;
        if (this.componentContent) {
          authoringComponentContent = this.componentContent;
          componentContent = this.componentContent;
        } else {
          authoringComponentContent = this.ProjectService.getComponentByNodeIdAndComponentId(this.nodeId, this.componentId);
          componentContent = this.ProjectService.injectAssetPaths(authoringComponentContent);
        }

        // replace any student names in the component content
        componentContent = this.ConfigService.replaceStudentNames(componentContent);

        if (this.NotebookService.isNotebookEnabled() && this.NotebookService.isStudentNoteClippingEnabled()) {
            // inject the click attribute that will snip the image when the image is clicked
            componentContent = this.ProjectService.injectClickToSnipImage(componentContent);
        }

        this.$scope.componentTemplatePath = this.NodeService.getComponentTemplatePath(componentContent.type);
        this.$scope.componentContent = componentContent;
        this.$scope.componentState = this.componentState;
        this.$scope.nodeId = this.nodeId;
        this.$scope.workgroupId = this.workgroupId;
        this.$scope.teacherWorkgroupId = this.teacherWorkgroupId;
        this.$scope.type = componentContent.type;
        this.$scope.nodeController = this.$scope.$parent.nodeController;

        if (this.mode === 'authoringComponentPreview') {
          this.$scope.$watch(
            () => { return this.componentContent; },
            () => {
              this.$scope.componentContent = this.componentContent;
              this.compileComponent();
          });
        } else {
          this.compileComponent();
        }
    }

    compileComponent() {
      const componentHTML =
          `<div class="component__wrapper">
            <div ng-include="::componentTemplatePath" class="component__content component__content--{{::type}}"></div>
          </div>`;
      this.$element.html(componentHTML);
      this.$compile(this.$element.contents())(this.$scope);
    }
}
ComponentController.$inject = ['$scope', '$compile', '$element', 'ConfigService', 'NodeService', 'NotebookService', 'ProjectService', 'StudentDataService'];

const Component = {
    bindings: {
        componentContent: '<',
        componentId: '@',
        componentState: '@',
        mode: '@',
        nodeId: '@',
        teacherWorkgroupId: '@',
        workgroupId: '@'
    },
    scope: true,
    controller: ComponentController
};

export default Component;
