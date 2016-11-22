angular.module('ToDo', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.controller('ToDoCtrl', function($scope, $ionicModal, $timeout){
  if (!angular.isUndefined(window.localStorage['tasks'])) {
    $scope.tasks = JSON.parse(localStorage['tasks']); 
  } else {
    $scope.tasks = [
      {title: 'Создать новую задачу', description: 'Посмотреть как это работает', done: false},
    ];
  }
  $ionicModal.fromTemplateUrl("views/tesk.html", function(modal){
    $scope.taskModal = modal;
  },{
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.currentTaskId = -1;

  $scope.addNewTask = function(){
    $scope.taskModal.show();
    $scope.activeTask = {
       title: "",
       description: "",
       done: false
    }
     $scope.currentTaskId = -1;
  }

  $scope.closeTask = function(){
    $scope.taskModal.hide();
  }

  $scope.openTask = function(id){
    var task = $scope.tasks[id];
    $scope.currentTaskId = id;
    $scope.activeTask = {
       title: task.title,
       description: task.description,
       done: task.done
    }
    $scope.taskModal.show();
  }

  $scope.deleteTask = function(id){
    $scope.tasks.splice(id, 1);
    saveItems();
  }

  $scope.submitTask = function(task){
    if ($scope.currentTaskId == -1) {
      $scope.tasks.push({
        title: task.title,
        description: task.description,
        done: task.done
      })
    } else {
      var id = $scope.currentTaskId;
      $scope.tasks[id].title = task.title;
      $scope.tasks[id].description = task.description;
      $scope.tasks[id].done = task.done;
    }
    $scope.taskModal.hide();
    saveItems();
  }

  $scope.saveTasks = function(){
    $timeout(function(){
      saveItems();
    })
  }
  
  function saveItems() {
    window.localStorage['tasks'] = angular.toJson($scope.tasks);
  }

})
