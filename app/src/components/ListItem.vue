<template>
    <div class="list-item">
      <v-card class="list-item-card">
        <div class="list-item-content">
          <div
            class="list-item_title"
            @dblclick="edit"
          >
            {{ item }}
          </div>
          <div>
            <v-btn
              fab
              depressed
              x-small
              color="error"
              @click="remove"
            >
              <v-icon dark>
                mdi-delete
              </v-icon>
            </v-btn>
          </div>
        </div>
      </v-card>
    </div>
</template>


<script>
export default {
  props: {
    item: {
      type: String,
      required: true
    }
  },
  methods: {
    edit() {
      this.$emit('edit');
    },
    remove() {
      this.$emit('remove');
    }
  }
}
</script>


<style>
.list-item {
  border: 1px solid #ccc;
  margin-bottom: 8px;
  width: 100%;
  cursor: move;
}

.list-item-card {
  width: 100%;
}

.list-item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.list-item_title {
  width: 100%;
  max-width: 90%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>