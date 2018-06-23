'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ComponentController = function () {
  function ComponentController($filter, $mdDialog, $rootScope, $scope, AnnotationService, ConfigService, NodeService, NotebookService, ProjectService, StudentAssetService, StudentDataService, UtilService) {
    _classCallCheck(this, ComponentController);

    this.$filter = $filter;
    this.$mdDialog = $mdDialog;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.AnnotationService = AnnotationService;
    this.ConfigService = ConfigService;
    this.NodeService = NodeService;
    this.NotebookService = NotebookService;
    this.ProjectService = ProjectService;
    this.StudentAssetService = StudentAssetService;
    this.StudentDataService = StudentDataService;
    this.UtilService = UtilService;
    this.$translate = this.$filter('translate');

    this.nodeId = this.$scope.nodeId;
    this.componentContent = this.$scope.componentContent;
    this.componentId = this.componentContent.id;
    this.componentType = this.componentContent.type;
    this.idToOrder = this.ProjectService.idToOrder;
    this.mode = this.$scope.mode;
    this.authoringComponentContent = this.$scope.authoringComponentContent;
    this.isShowPreviousWork = false;
    this.showAdvancedAuthoring = false;
    this.showJSONAuthoring = false;
    this.isDisabled = false;
    this.isDirty = false;
    this.parentStudentWorkIds = null;

    // whether the student work has changed since last submit
    this.isSubmitDirty = false;

    // whether the student work is for a submit
    this.isSubmit = false;

    this.saveMessage = {
      text: '',
      time: ''
    };

    // whether students can attach files to their work
    this.isStudentAttachmentEnabled = false;

    this.isPromptVisible = true;
    this.isSaveButtonVisible = false;
    this.isSubmitButtonVisible = false;
    this.isSubmitButtonDisabled = false;
    this.submitCounter = 0;

    this.isSnipButtonVisible = true;

    this.workgroupId = this.$scope.workgroupId;
    this.teacherWorkgroupId = this.$scope.teacherWorkgroupId;

    this.showAddToNotebookButton = this.componentContent.showAddToNotebookButton == null ? true : this.componentContent.showAddToNotebookButton;

    if (this.mode === 'grading' || this.mode === 'gradingRevision' || this.mode === 'onlyShowWork') {
      this.showAddToNotebookButton = false;
    } else if (this.mode === 'authoring') {
      if (this.authoringComponentContent.showAddToNotebookButton == null) {
        this.authoringComponentContent.showAddToNotebookButton = true;
      }
    }

    this.registerListeners();
  }

  _createClass(ComponentController, [{
    key: 'registerListeners',
    value: function registerListeners() {
      var _this = this;

      this.$scope.$on('annotationSavedToServer', function (event, args) {
        var annotation = args.annotation;
        if (_this.nodeId === annotation.nodeId && _this.componentId === annotation.componentId) {
          _this.latestAnnotations = _this.AnnotationService.getLatestComponentAnnotations(_this.nodeId, _this.componentId, _this.workgroupId);
        }
      });

      this.$scope.$on('nodeSubmitClicked', function (event, args) {
        if (_this.nodeId === args.nodeId) {
          _this.handleNodeSubmit();
        }
      });

      this.registerStudentWorkSavedToServerListener();
    }
  }, {
    key: 'registerStudentWorkSavedToServerListener',
    value: function registerStudentWorkSavedToServerListener() {
      this.$scope.$on('studentWorkSavedToServer', angular.bind(this, function (event, args) {
        var componentState = args.studentWork;
        if (componentState && this.nodeId === componentState.nodeId && this.componentId === componentState.componentId) {
          this.isDirty = false;
          this.$scope.$emit('componentDirty', { componentId: this.componentId, isDirty: this.isDirty });
          var clientSaveTime = this.ConfigService.convertToClientTimestamp(componentState.serverSaveTime);
          if (componentState.isSubmit) {
            this.setSaveMessage(this.$translate('SUBMITTED'), clientSaveTime);
            this.lockIfNecessary();
            this.isSubmitDirty = false;
            this.$scope.$emit('componentSubmitDirty', { componentId: this.componentId, isDirty: this.isSubmitDirty });
          } else if (componentState.isAutoSave) {
            this.setSaveMessage(this.$translate('AUTO_SAVED'), clientSaveTime);
          } else {
            this.setSaveMessage(this.$translate('SAVED'), clientSaveTime);
          }
        }
      }));
    }
  }, {
    key: 'handleNodeSubmit',
    value: function handleNodeSubmit() {
      this.isSubmit = true;
    }
  }, {
    key: 'getPrompt',
    value: function getPrompt() {
      return this.componentContent.prompt;
    }
  }, {
    key: 'saveButtonClicked',
    value: function saveButtonClicked() {
      this.isSubmit = false;

      // tell the parent node to save
      this.$scope.$emit('componentSaveTriggered', { nodeId: this.nodeId, componentId: this.componentId });
    }
  }, {
    key: 'submitButtonClicked',
    value: function submitButtonClicked() {
      this.submit('componentSubmitButton');
    }
  }, {
    key: 'submit',
    value: function submit(submitTriggeredBy) {}
  }, {
    key: 'incrementSubmitCounter',
    value: function incrementSubmitCounter() {
      this.submitCounter++;
    }
  }, {
    key: 'disableComponentIfNecessary',
    value: function disableComponentIfNecessary() {
      if (this.isLockAfterSubmit()) {
        var componentStates = this.StudentDataService.getComponentStatesByNodeIdAndComponentId(this.nodeId, this.componentId);
        if (this.NodeService.isWorkSubmitted(componentStates)) {
          this.isDisabled = true;
        }
      }
    }
  }, {
    key: 'lockIfNecessary',
    value: function lockIfNecessary() {
      if (this.isLockAfterSubmit()) {
        this.isDisabled = true;
      }
    }
  }, {
    key: 'isLockAfterSubmit',
    value: function isLockAfterSubmit() {
      return this.componentContent.lockAfterSubmit;
    }
  }, {
    key: 'studentDataChanged',
    value: function studentDataChanged() {
      var _this2 = this;

      /*
       * set the dirty flags so we will know we need to save or submit the
       * student work later
       */
      this.isDirty = true;
      this.$scope.$emit('componentDirty', { componentId: this.componentId, isDirty: true });

      this.isSubmitDirty = true;
      this.$scope.$emit('componentSubmitDirty', { componentId: this.componentId, isDirty: true });
      this.setSaveMessage('', null);

      /*
       * the student work in this component has changed so we will tell
       * the parent node that the student data will need to be saved.
       * this will also notify connected parts that this component's student
       * data has changed.
       */
      var action = 'change';

      // create a component state populated with the student data
      this.createComponentState(action).then(function (componentState) {
        _this2.$scope.$emit('componentStudentDataChanged', { nodeId: _this2.nodeId, componentId: _this2.componentId, componentState: componentState });
      });
    }

    /**
     * Set the message next to the save button
     * @param message the message to display
     * @param time the time to display
     */

  }, {
    key: 'setSaveMessage',
    value: function setSaveMessage(message, time) {
      this.saveMessage.text = message;
      this.saveMessage.time = time;
    }

    /**
     * Get all the step node ids in the project
     * @returns {array} an array of step node id strings
     */

  }, {
    key: 'getStepNodeIds',
    value: function getStepNodeIds() {
      return this.ProjectService.getNodeIds();
    }

    /**
     * Get the step number and title for a node
     * @param {string} get the step number and title for this node
     * @returns {string} the step number and title example "1.5: Read Information"
     */

  }, {
    key: 'getNodePositionAndTitleByNodeId',
    value: function getNodePositionAndTitleByNodeId(nodeId) {
      return this.ProjectService.getNodePositionAndTitleByNodeId(nodeId);
    }

    /**
     * Get the components in a step
     * @param {string} id of the step
     * @returns {array} an array of component objects
     */

  }, {
    key: 'getComponentsByNodeId',
    value: function getComponentsByNodeId(nodeId) {
      return this.ProjectService.getComponentsByNodeId(nodeId);
    }

    /**
     * Check if a node is a step node
     * @param {string} nodeId the node id to check
     * @returns {boolean} whether the node is a step node
     */

  }, {
    key: 'isApplicationNode',
    value: function isApplicationNode(nodeId) {
      return this.ProjectService.isApplicationNode(nodeId);
    }

    /**
     * Perform any additional processing that is required before returning the
     * component state
     * Note: this function must call deferred.resolve() otherwise student work
     * will not be saved
     * @param deferred a deferred object
     * @param componentState the component state
     * @param action the action that we are creating the component state for
     * e.g. 'submit', 'save', 'change'
     */

  }, {
    key: 'createComponentStateAdditionalProcessing',
    value: function createComponentStateAdditionalProcessing(deferred, componentState, action) {
      /*
       * we don't need to perform any additional processing so we can resolve
       * the promise immediately
       */
      deferred.resolve(componentState);
    }

    /**
     * Import any work needed from connected components
     */

  }, {
    key: 'handleConnectedComponents',
    value: function handleConnectedComponents() {
      var connectedComponents = this.componentContent.connectedComponents;
      if (connectedComponents != null) {
        var componentStates = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = connectedComponents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var connectedComponent = _step.value;

            var componentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(connectedComponent.nodeId, connectedComponent.componentId);
            if (componentState != null) {
              componentStates.push(this.UtilService.makeCopyOfJSONObject(componentState));
            }
            if (connectedComponent.type == 'showWork') {
              this.isDisabled = true;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        this.setStudentWork(this.createMergedComponentState(componentStates));
        this.handleConnectedComponentsPostProcess();
        this.studentDataChanged();
      }
    }
  }, {
    key: 'handleConnectedComponentsPostProcess',
    value: function handleConnectedComponentsPostProcess() {
      // overriden by children
    }
  }, {
    key: 'showCopyPublicNotebookItemButton',
    value: function showCopyPublicNotebookItemButton() {
      return this.ProjectService.isSpaceExists("public");
    }
  }, {
    key: 'copyPublicNotebookItemButtonClicked',
    value: function copyPublicNotebookItemButtonClicked(event) {
      this.$rootScope.$broadcast('openNotebook', { nodeId: this.nodeId, componentId: this.componentId, insertMode: true, requester: this.nodeId + '-' + this.componentId, visibleSpace: "public" });
    }
  }, {
    key: 'importWorkByStudentWorkId',
    value: function importWorkByStudentWorkId(studentWorkId) {
      var _this3 = this;

      this.StudentDataService.getStudentWorkById(studentWorkId).then(function (componentState) {
        if (componentState != null) {
          _this3.setStudentWork(componentState);
          _this3.setParentStudentWorkIdToCurrentStudentWork(studentWorkId);
          _this3.$rootScope.$broadcast('closeNotebook');
        }
      });
    }
  }, {
    key: 'setParentStudentWorkIdToCurrentStudentWork',
    value: function setParentStudentWorkIdToCurrentStudentWork(studentWorkId) {
      this.parentStudentWorkIds = [studentWorkId];
    }
  }, {
    key: 'isNotebookEnabled',
    value: function isNotebookEnabled() {
      return this.NotebookService.isNotebookEnabled();
    }
  }, {
    key: 'isAddToNotebookEnabled',
    value: function isAddToNotebookEnabled() {
      return this.isNotebookEnabled() && this.showAddToNotebookButton;
    }

    /**
     * Get the connected component type
     * @param connectedComponent get the component type of this connected component
     * @return the connected component type
     */

  }, {
    key: 'authoringGetConnectedComponentType',
    value: function authoringGetConnectedComponentType(connectedComponent) {

      var connectedComponentType = null;

      if (connectedComponent != null) {

        // get the node id and component id of the connected component
        var nodeId = connectedComponent.nodeId;
        var componentId = connectedComponent.componentId;

        // get the component
        var component = this.ProjectService.getComponentByNodeIdAndComponentId(nodeId, componentId);

        if (component != null) {
          // get the component type
          connectedComponentType = component.type;
        }
      }

      return connectedComponentType;
    }
  }, {
    key: 'addTag',
    value: function addTag() {
      if (this.authoringComponentContent.tags == null) {
        this.authoringComponentContent.tags = [];
      }
      this.authoringComponentContent.tags.push('');
      this.authoringViewComponentChanged();
    }

    /**
     * Move a tag up
     * @param index the index of the tag to move up
     */

  }, {
    key: 'moveTagUp',
    value: function moveTagUp(index) {
      if (index > 0) {
        // the index is not at the top so we can move it up
        var tag = this.authoringComponentContent.tags[index];
        this.authoringComponentContent.tags.splice(index, 1);
        this.authoringComponentContent.tags.splice(index - 1, 0, tag);
        this.authoringViewComponentChanged();
      }
    }

    /**
     * Move a tag down
     * @param index the index of the tag to move down
     */

  }, {
    key: 'moveTagDown',
    value: function moveTagDown(index) {
      if (index < this.authoringComponentContent.tags.length - 1) {
        // the index is not at the bottom so we can move it down
        var tag = this.authoringComponentContent.tags[index];
        this.authoringComponentContent.tags.splice(index, 1);
        this.authoringComponentContent.tags.splice(index + 1, 0, tag);
        this.authoringViewComponentChanged();
      }
    }
  }, {
    key: 'deleteTag',
    value: function deleteTag(indexOfTagToDelete) {
      if (confirm(this.$translate('areYouSureYouWantToDeleteThisTag'))) {
        this.authoringComponentContent.tags.splice(indexOfTagToDelete, 1);
        this.authoringViewComponentChanged();
      }
    }
  }]);

  return ComponentController;
}();

ComponentController.$inject = [];

exports.default = ComponentController;
//# sourceMappingURL=componentController.js.map