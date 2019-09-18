'use strict';

import $ from 'jquery';
import AchievementService from '../services/achievementService';
import angular from 'angular';
import angularDragula from 'angular-dragula';
import angularFileUpload from 'ng-file-upload';
import angularHighcharts from 'highcharts-ng';
import angularMaterial from 'angular-material';
import angularMoment from 'angular-moment';
import angularOnload from 'ng-onload';
import angularSanitize from 'angular-sanitize';
import angularSock from 'angular-sockjs';
import angularStomp from '../lib/stomp/ng-stomp.standalone.min';
import angularToArrayFilter from 'lib/angular-toArrayFilter/toArrayFilter';
import angularTranslate from 'angular-translate';
import angularTranslateLoaderPartial from 'angular-translate-loader-partial';
import angularUIRouter from 'angular-ui-router';
import angularUIScrollpoint from 'angular-ui-scrollpoint';
import angularWebSocket from 'angular-websocket';
import AnimationComponentModule from '../components/animation/animationComponentModule';
import AnnotationService from '../services/annotationService';
import AudioOscillatorComponentModule from '../components/audioOscillator/audioOscillatorComponentModule';
import canvg from 'canvg';
import ConceptMapComponentModule from '../components/conceptMap/conceptMapComponentModule';
import ConfigService from '../services/configService';
import CRaterService from '../services/cRaterService';
import Components from '../directives/components';
import ComponentService from '../components/componentService';
import DiscussionComponentModule from '../components/discussion/discussionComponentModule';
import DrawComponentModule from '../components/draw/drawComponentModule';
import EmbeddedComponentModule from '../components/embedded/embeddedComponentModule';
import Filters from '../filters/filters';
import Highcharts from '../lib/highcharts@4.2.1';
import HighchartsExporting from '../lib/highcharts-exporting@4.2.1';
import draggablePoints from '../lib/draggable-points/draggable-points';
import GraphComponentModule from '../components/graph/graphComponentModule';
import HTMLComponentModule from '../components/html/htmlComponentModule';
import HttpInterceptor from '../services/httpInterceptor';
import LabelComponentModule from '../components/label/labelComponentModule';
import MatchComponentModule from '../components/match/matchComponentModule';
import MultipleChoiceComponentModule from '../components/multipleChoice/multipleChoiceComponentModule';
import NavigationController from './navigation/navigationController';
import NodeController from './node/nodeController';
import NodeService from '../services/nodeService';
import NotebookService from '../services/notebookService';
import NotificationService from '../services/notificationService';
import OpenResponseComponentModule from '../components/openResponse/openResponseComponentModule';
import OutsideURLComponentModule from '../components/outsideURL/outsideURLComponentModule';
import PlanningService from '../services/planningService';
import ProjectService from '../services/projectService';
import SessionService from '../services/sessionService';
import StudentAsset from './studentAsset/studentAsset';
import StudentAssetService from '../services/studentAssetService';
import StudentDataService from '../services/studentDataService';
import StudentStatusService from '../services/studentStatusService';
import StudentWebSocketService from '../services/studentWebSocketService';
import SummaryComponentModule from '../components/summary/summaryComponentModule';
import TableComponentModule from '../components/table/tableComponentModule';
import UtilService from '../services/utilService';
import VLEController from './vleController';
import VLEProjectService from './vleProjectService';
import ocLazyLoad from 'oclazyload';
import moment from 'moment';
import angularSummernote from 'lib/angular-summernote/dist/angular-summernote.min';

const vleModule = angular.module('vle', [
    angularDragula(angular),
    'summaryComponentModule',
    'angularMoment',
    'angular-toArrayFilter',
    'animationComponentModule',
    'audioOscillatorComponentModule',
    'components',
    'conceptMapComponentModule',
    'discussionComponentModule',
    'drawComponentModule',
    'embeddedComponentModule',
    'filters',
    'graphComponentModule',
    'highcharts-ng',
    'htmlComponentModule',
    'labelComponentModule',
    'matchComponentModule',
    'multipleChoiceComponentModule',
    'ngAria',
    'ngFileUpload',
    'ngMaterial',
    'ngOnload',
    'ngSanitize',
    'bd.sockjs',
    'ngStomp',
    'ngWebSocket',
    'oc.lazyLoad',
    'openResponseComponentModule',
    'outsideURLComponentModule',
    'pascalprecht.translate',
    'studentAsset',
    'summernote',
    'tableComponentModule',
    'ui.router',
    'ui.scrollpoint'])
  .service(AchievementService.name, AchievementService)
  .service(AnnotationService.name, AnnotationService)
  .service(ConfigService.name, ConfigService)
  .service(ComponentService.name, ComponentService)
  .service(CRaterService.name, CRaterService)
  .service(HttpInterceptor.name, HttpInterceptor)
  .service(NodeService.name, NodeService)
  .service(NotebookService.name, NotebookService)
  .service(NotificationService.name, NotificationService)
  .service(PlanningService.name, PlanningService)
  .service(ProjectService.name, VLEProjectService)
  .service(SessionService.name, SessionService)
  .service(StudentAssetService.name, StudentAssetService)
  .service(StudentDataService.name, StudentDataService)
  .service(StudentStatusService.name, StudentStatusService)
  .service(StudentWebSocketService.name, StudentWebSocketService)
  .service(UtilService.name, UtilService)
  .controller(NavigationController.name, NavigationController)
  .controller(NodeController.name, NodeController)
  .controller(VLEController.name, VLEController)
  .filter(Filters.name, Filters)
  .config([
      '$urlRouterProvider',
      '$stateProvider',
      '$translateProvider',
      '$translatePartialLoaderProvider',
      '$controllerProvider',
      '$mdThemingProvider',
      '$httpProvider',
      '$provide',
      ($urlRouterProvider,
      $stateProvider,
      $translateProvider,
      $translatePartialLoaderProvider,
      $controllerProvider,
      $mdThemingProvider,
      $httpProvider,
      $provide) => {
      $urlRouterProvider.otherwise('/vle/');

      angular.module('vle').$controllerProvider = $controllerProvider;

      $stateProvider
        .state('root', {
          url: '',
          abstract: true,
          templateProvider: ['$http', 'ProjectService', ($http, ProjectService) => {
            let themePath = ProjectService.getThemePath();
            return $http.get(themePath + '/vle.html').then(
              response => {
                return response.data;
              });
          }],
          controller: 'VLEController',
          controllerAs: 'vleController',
          resolve: {
            config: (ConfigService) => {
              let configURL = window.configURL;
              return ConfigService.retrieveConfig(configURL);
            },
            project: (ProjectService, config) => {
              return ProjectService.retrieveProject();
            },
            studentData: (StudentDataService, config, project) => {
              return StudentDataService.retrieveStudentData();
            },
            notebook: (NotebookService, ConfigService, StudentAssetService, studentData, config, project) => {
              return StudentAssetService.retrieveAssets().then((studentAssets) => {
                return NotebookService.retrieveNotebookItems(ConfigService.getWorkgroupId()).then((notebook) => {
                  return notebook;
                });
              });
            },
            achievements: (AchievementService, studentData, config, project) => {
              return AchievementService.retrieveStudentAchievements();
            },
            notifications: (NotificationService, studentData, config, project) => {
              return NotificationService.retrieveNotifications();
            },
            runStatus: (StudentDataService, config) => {
              return StudentDataService.retrieveRunStatus();
            },
            webSocket: (StudentWebSocketService, ConfigService, config, project) => {
              if (!ConfigService.isPreview()) {
                return StudentWebSocketService.initialize();
              }
            },
            language: ($translate, ConfigService, config) => {
              let locale = ConfigService.getLocale();  // defaults to "en"
              $translate.use(locale);
            },
            theme: (ProjectService, config, project, $ocLazyLoad, $q) => {
              let theme = ProjectService.getThemePath() + '/theme.js';
              let def = $q.defer();

              System.import(theme).then(m => {
                let themeModule = m.default;
                if (!m.default.name) {
                  let key = Object.keys(m.default);
                  themeModule = m.default[key[0]];
                }

                $ocLazyLoad.load(themeModule).then(() => {
                  def.resolve();
                }, err => {
                  throw err;
                });
              });

              return def.promise;
            }
          }
        })
        .state('root.vle', {
          url: '/vle/:nodeId',
          views: {
            'nodeView': {
              templateProvider: ['$http', 'ConfigService', ($http, ConfigService) => {
                let wiseBaseURL = ConfigService.getWISEBaseURL();
                return $http.get(wiseBaseURL + '/wise5/vle/node/index.html').then(
                  response => {
                    return response.data;
                  }
                );
              }],
              controller: 'NodeController',
              controllerAs: 'nodeController'
            }
          }
        })
        .state('root.component', {
          url: '/vle/:nodeId/:componentId',
          views: {
            'nodeView': {
              templateProvider: ['$http', 'ConfigService', ($http, ConfigService) => {
                let wiseBaseURL = ConfigService.getWISEBaseURL();
                return $http.get(wiseBaseURL + '/wise5/vle/node/index.html').then(
                  response => {
                    return response.data;
                  }
                );
              }],
              controller: 'NodeController',
              controllerAs: 'nodeController'
            }
          }
        });

      $httpProvider.interceptors.push('HttpInterceptor');

      // Set up Translations
      $translatePartialLoaderProvider.addPart('i18n');
      $translatePartialLoaderProvider.addPart('vle/i18n');
      $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: 'wise5/{part}/i18n_{lang}.json'
      })
        .fallbackLanguage(['en'])
        .registerAvailableLanguageKeys(['ar','el','en','es','ja','ko','pt','tr','zh_CN','zh_TW'], {
          'en_US': 'en',
          'en_UK': 'en'
        })
        .determinePreferredLanguage()
        .useSanitizeValueStrategy('sanitizeParameters', 'escape');

      // ngMaterial default theme configuration
      // TODO: make dynamic and support alternate themes; allow projects to specify theme parameters and settings
      $mdThemingProvider.definePalette('primary', {
        '50': 'e1f0f4',
        '100': 'b8dbe4',
        '200': '8ec6d4',
        '300': '5faec2',
        '400': '3d9db5',
        '500': '1c8ca8',
        '600': '197f98',
        '700': '167188',
        '800': '136377',
        '900': '0e4957',
        'A100': 'abf3ff',
        'A200': '66e2ff',
        'A400': '17bee5',
        'A700': '00A1C6',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                            // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
          '200', '300', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
      });

      $mdThemingProvider.definePalette('accent', {
        '50': 'fde9e6',
        '100': 'fbcbc4',
        '200': 'f8aca1',
        '300': 'f4897b',
        '400': 'f2705f',
        '500': 'f05843',
        '600': 'da503c',
        '700': 'c34736',
        '800': 'aa3e2f',
        '900': '7d2e23',
        'A100': 'ff897d',
        'A200': 'ff7061',
        'A400': 'ff3829',
        'A700': 'cc1705',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50', '100',
          '200', '300', 'A100'],
        'contrastLightColors': undefined
      });

      $mdThemingProvider.theme('default')
        .primaryPalette('primary')
        .accentPalette('accent',  {
          'default': '500'
        })
        .warnPalette('red', {
          'default': '800'
        });

      let lightMap = $mdThemingProvider.extendPalette('grey', {
        'A100': 'ffffff'
      });
      $mdThemingProvider.definePalette('light', lightMap);

      $mdThemingProvider.theme('light')
        .primaryPalette('light', {
          'default': 'A100'
        })
        .accentPalette('primary');

      $mdThemingProvider.setDefaultTheme('default');
      $mdThemingProvider.enableBrowserColor();

      // moment.js default overrides
      // TODO: add i18n support
      moment.updateLocale('en', {
        calendar: {
          lastDay : '[Yesterday at] LT',
          sameDay : '[Today at] LT',
          nextDay : '[Tomorrow at] LT',
          lastWeek : '[last] dddd [at] LT',
          nextWeek : 'dddd [at] LT',
          sameElse : 'll'
        }
      });
    }
  ]);
export default vleModule;
