'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _summaryController = _interopRequireDefault(require("./summaryController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SummaryAuthoringController =
/*#__PURE__*/
function (_SummaryController) {
  _inherits(SummaryAuthoringController, _SummaryController);

  function SummaryAuthoringController($filter, $injector, $mdDialog, $rootScope, $scope, AnnotationService, ConfigService, NodeService, NotebookService, ProjectService, StudentAssetService, StudentDataService, SummaryService, UtilService) {
    var _this;

    _classCallCheck(this, SummaryAuthoringController);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SummaryAuthoringController).call(this, $filter, $mdDialog, $rootScope, $scope, AnnotationService, ConfigService, NodeService, NotebookService, ProjectService, StudentAssetService, StudentDataService, SummaryService, UtilService));
    _this.$injector = $injector;
    _this.isResponsesOptionAvailable = false;
    _this.isHighlightCorrectAnswerAvailable = false;
    _this.isPieChartAllowed = true;

    _this.updateStudentDataTypeOptionsIfNecessary();

    _this.updateHasCorrectAnswerIfNecessary();

    _this.updateChartTypeOptionsIfNecessary();

    return _this;
  }

  _createClass(SummaryAuthoringController, [{
    key: "authoringSummaryNodeIdChanged",
    value: function authoringSummaryNodeIdChanged() {
      this.authoringComponentContent.summaryComponentId = null;
      var components = this.getComponentsByNodeId(this.authoringComponentContent.summaryNodeId);
      var allowedComponents = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = components[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var component = _step.value;

          if (this.isComponentTypeAllowed(component.type) && component.id != this.componentId) {
            allowedComponents.push(component);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (allowedComponents.length === 1) {
        this.authoringComponentContent.summaryComponentId = allowedComponents[0].id;
      }

      this.performUpdatesIfNecessary();
      this.authoringViewComponentChanged();
    }
  }, {
    key: "isComponentTypeAllowed",
    value: function isComponentTypeAllowed(componentType) {
      return this.SummaryService.isComponentTypeAllowed(componentType);
    }
  }, {
    key: "authoringSummaryComponentIdChanged",
    value: function authoringSummaryComponentIdChanged() {
      this.performUpdatesIfNecessary();
      this.authoringViewComponentChanged();
    }
  }, {
    key: "studentDataTypeChanged",
    value: function studentDataTypeChanged() {
      this.updateHasCorrectAnswerIfNecessary();
      this.updateChartTypeOptionsIfNecessary();
      this.authoringViewComponentChanged();
    }
  }, {
    key: "performUpdatesIfNecessary",
    value: function performUpdatesIfNecessary() {
      this.updateOtherPrompt();
      this.updateStudentDataTypeOptionsIfNecessary();
      this.updateStudentDataTypeIfNecessary();
      this.updateHasCorrectAnswerIfNecessary();
      this.updateChartTypeOptionsIfNecessary();
    }
  }, {
    key: "updateOtherPrompt",
    value: function updateOtherPrompt() {
      this.otherPrompt = this.getOtherPrompt(this.authoringComponentContent.summaryNodeId, this.authoringComponentContent.summaryComponentId);
    }
  }, {
    key: "updateStudentDataTypeOptionsIfNecessary",
    value: function updateStudentDataTypeOptionsIfNecessary() {
      var nodeId = this.authoringComponentContent.summaryNodeId;
      var componentId = this.authoringComponentContent.summaryComponentId;
      this.isResponsesOptionAvailable = this.isStudentDataTypeAvailableForComponent(nodeId, componentId, 'responses');
    }
  }, {
    key: "updateStudentDataTypeIfNecessary",
    value: function updateStudentDataTypeIfNecessary() {
      var nodeId = this.authoringComponentContent.summaryNodeId;
      var componentId = this.authoringComponentContent.summaryComponentId;
      var studentDataType = this.authoringComponentContent.studentDataType;

      if (!this.isStudentDataTypeAvailableForComponent(nodeId, componentId, studentDataType)) {
        if (this.isStudentDataTypeAvailableForComponent(nodeId, componentId, 'scores')) {
          this.authoringComponentContent.studentDataType = 'scores';
        } else {
          this.authoringComponentContent.studentDataType = null;
        }
      }
    }
  }, {
    key: "updateHasCorrectAnswerIfNecessary",
    value: function updateHasCorrectAnswerIfNecessary() {
      this.isHighlightCorrectAnswerAvailable = this.componentHasCorrectAnswer() && this.authoringComponentContent.studentDataType === 'responses';

      if (!this.isHighlightCorrectAnswerAvailable) {
        this.authoringComponentContent.highlightCorrectAnswer = false;
      }
    }
  }, {
    key: "updateChartTypeOptionsIfNecessary",
    value: function updateChartTypeOptionsIfNecessary() {
      this.isPieChartAllowed = this.authoringComponentContent.studentDataType === 'scores' || !this.componentAllowsMultipleResponses();

      if (!this.isPieChartAllowed && this.authoringComponentContent.chartType === 'pie') {
        this.authoringComponentContent.chartType = 'column';
      }
    }
  }, {
    key: "isStudentDataTypeAvailableForComponent",
    value: function isStudentDataTypeAvailableForComponent(nodeId, componentId, studentDataType) {
      var component = this.ProjectService.getComponentByNodeIdAndComponentId(nodeId, componentId);

      if (component != null) {
        if (studentDataType === 'scores') {
          return this.SummaryService.isScoresSummaryAvailableForComponentType(component.type);
        } else if (studentDataType === 'responses') {
          return this.SummaryService.isResponsesSummaryAvailableForComponentType(component.type);
        }
      }

      return false;
    }
  }, {
    key: "showPromptFromOtherComponentChanged",
    value: function showPromptFromOtherComponentChanged() {
      this.updateOtherPrompt();
      this.authoringViewComponentChanged();
    }
  }, {
    key: "componentHasCorrectAnswer",
    value: function componentHasCorrectAnswer() {
      var nodeId = this.authoringComponentContent.summaryNodeId;
      var componentId = this.authoringComponentContent.summaryComponentId;

      if (nodeId != null && componentId != null) {
        var component = this.ProjectService.getComponentByNodeIdAndComponentId(nodeId, componentId);

        if (component != null) {
          var componentService = this.$injector.get(component.type + 'Service');
          return componentService.componentHasCorrectAnswer(component);
        }
      }

      return false;
    }
  }, {
    key: "componentAllowsMultipleResponses",
    value: function componentAllowsMultipleResponses() {
      var nodeId = this.authoringComponentContent.summaryNodeId;
      var componentId = this.authoringComponentContent.summaryComponentId;

      if (nodeId != null && componentId != null) {
        var component = this.ProjectService.getComponentByNodeIdAndComponentId(nodeId, componentId);

        if (component != null) {
          return component.choiceType === 'checkbox';
        }
      }

      return false;
    }
  }]);

  return SummaryAuthoringController;
}(_summaryController["default"]);

SummaryAuthoringController.$inject = ['$filter', '$injector', '$mdDialog', '$rootScope', '$scope', 'AnnotationService', 'ConfigService', 'NodeService', 'NotebookService', 'ProjectService', 'StudentAssetService', 'StudentDataService', 'SummaryService', 'UtilService'];
var _default = SummaryAuthoringController;
exports["default"] = _default;
//# sourceMappingURL=summaryAuthoringController.js.map
