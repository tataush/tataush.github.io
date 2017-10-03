<template>
<div>
    <div class="tods">
        <div class="todu-list">
            <div class="todo-list_item" v-for="todo in todos">
                <div class="todo-list_item-number">{{todo.id}}</div>
                <div class="todo-list_item-title" v-bind:class="{ done: todo.completed }">{{todo.title}}</div>
                <div class="todo-list_item-status" v-bind:class="{ done: todo.completed }" @click="show( (todo.id) - 1 )"></div>
            </div>
        </div>
        <button @click="nextPage()" class="nextPage" v-bind:disabled="nextDisable">Next</button>
        <button @click="prevPage()" class="prevPage" v-bind:disabled="prevDisable">Prev</button>
    </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    head: {
        title: 'ToDos',
    },
    data: function() {
        return {
          todos: [],
          errors: [],
          start: 0,
          end: 10,
          step: 10,
          all: [],
          count: 0,
          pageCount: 0,
          nextDisable: false,
          prevDisable: false
        }
    },
  methods: {
      show: function (e) {
          this.all[e].completed = !this.all[e].completed;
      },
      nextPage: function(){
        if (this.end <= this.count - this.step) {
            this.start += this.step;
            this.end += this.step;
            this.todos = this.all.slice(this.start, this.end);
            this.pageCount = this.count / this.step;
        } else {
            this.nextDisable = true;
            this.prevDisable = false;
        }
      },
      prevPage: function(){
        if (this.end >= this.step * 2) {
            this.start -= this.step;
            this.end -= this.step;
            this.todos = this.all.slice(this.start, this.end);
            this.pageCount = this.count / this.step;
            this.nextDisable = false;
        } else {
            this.prevDisable = true;
        }
      }
  },
  created() {
    axios.get('/todos.json').then(response => {
        this.all = response.data;
        this.todos = this.all.slice(this.start, this.end);
        this.count = this.all.length;
    }, function(e){
        console.log('error');
    });
  }
}
</script>

<style>
.tods {
    width: 500px;
    margin: 20px auto;
    height: 670px;
    overflow: auto;
}

.todo-list_item {
    background: #fff;
    margin-bottom: 5px;
    border-right: 3px;
    position: relative;
    padding: 5px 58px;
    min-height: 58px;
    position: relative;
    border-bottom: 1px solid #999;
}

.todo-list_item-number {
    width: 58px;
    height: 58px;
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    line-height: 58px;
    font-size: 20px;
}

.todo-list_item-status {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    position: absolute;
    top: 14px;
    right: 14px;
    background: red;
    cursor: pointer;
}

.todo-list_item-title.done {
    text-decoration: line-through;
}

.todo-list_item-status.done {
    background: green;
}

.nextPage {
    float: right;
}
</style>