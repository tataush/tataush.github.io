<template>
  <div>
    <div class="list pt-5">
      <div class="pl-4 pr-4 text-right">
        <v-btn color="secondary" small @click="editDialog = true">
          <v-icon> mdi-plus </v-icon> Add Item
        </v-btn>
      </div>

      <v-list dense>
        <draggable v-model="currentList" @end="sortItems">
          <v-list-item
            v-for="(item, index) in currentList"
            :key="index"
          >
            <list-item
              :item="item"
              @edit="editItem(index)"
              @remove="removeItem(index)"
            />
          </v-list-item>
        </draggable>
      </v-list>
    </div>

    <v-pagination
      v-model="currentPage"
      :length="pageLength"
      :total-visible="7"
    ></v-pagination>

    <v-dialog v-model="editDialog" persistent max-width="390">
      <v-card>
        <v-card-title class="headline">
          {{ editableItemIndex != undefined  ? 'Edit' : 'Add' }} Item
        </v-card-title>
        <v-form
          lazy-validation
          ref="form"
          v-model="valid"
          @submit.prevent="saveItem"
        >
          <v-card-text>
            <v-text-field
              v-model.trim="itemName"
              label="Item name"
              placeholder="Name..."
              autofocus
              :rules="[v => !!v || 'Item is required']"
            ></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="error"
              depressed
              @click="closeDialog"
            >
              Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              depressed
              type="submit"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import ListItem from './ListItem'
  import draggable from 'vuedraggable'
  export default {
    data() {
      return {
        list: [],
        listByPages: [],
        currentList: [],
        currentPage: 1,
        pearPage: 10,
        editDialog: false,
        valid: true,
        itemName: '',
        editableItemIndex: undefined
      }
    },
    computed: {
      pageLength() {
        return Math.ceil(this.list.length / this.pearPage)
      }
    },
    methods: {
      randomString(stringLength) {
        let string = '';
        const stringTemplate = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = stringTemplate.length;
        for ( let i = 0; i < stringLength; i++ ) {
          string += stringTemplate.charAt(Math.floor(Math.random() * charactersLength));
        }
        return string;
      },
      getItemsList() {
        const listData = JSON.parse(localStorage.getItem('list'))
        if (!listData || !listData.length) {
          for (let i = 0; i < 100; i++) {
            this.list.push(this.randomString(10));
          }
        } else {
          this.list = listData;
        }

        this.saveLocally();
      },
      splitToPages() {
        let subarray = [];
        for (let i = 0; i <= this.list.length; i += this.pearPage) {
          subarray.push(this.list.slice(i, i + this.pearPage));
        }

        this.listByPages = subarray;
        this.getCurrentPage();
      },
      getCurrentPage() {
        this.currentList = this.listByPages[this.currentPage - 1];
      },
      editItem(index) {
        this.editableItemIndex = index;

        if (this.currentPage > 1) {
          this.editableItemIndex = index + (this.currentPage - 1) * this.pearPage;
        }

        this.itemName = this.list[this.editableItemIndex];
        this.editDialog = true;
      },
      removeItem(index) {
        let itemIndex = index;

        if (this.currentPage > 1) {
          itemIndex = index + (this.currentPage - 1) * this.pearPage;
        }

        this.list.splice(itemIndex, 1);
        this.saveLocally();
        this.splitToPages();
      },
      saveItem() {
        this.$refs.form.validate();

        if (this.valid) {
          if (this.editableItemIndex !== undefined) {
            this.list[this.editableItemIndex] = this.itemName
          } else {
            this.list.unshift(this.itemName);
          }
          this.splitToPages();
          this.saveLocally();
          this.closeDialog();
        }
      },
      closeDialog() {
        this.$refs.form.resetValidation();
        this.editDialog = false;
        this.editableItemIndex = undefined;
        this.itemName = '';
      },
      sortItems() {
        let startIndex = 0;

        if (this.currentPage > 1) {
          startIndex = (this.currentPage - 1)  * this.pearPage;
        }

        this.list.splice(startIndex, this.pearPage, ...this.currentList);
        this.saveLocally();
      },
      saveLocally() {
        localStorage.setItem('list', JSON.stringify(this.list));
      }
    },
    async mounted() {
      await this.getItemsList();
      this.splitToPages();
    },
    components: {
      ListItem,
      draggable
    },
    watch: {
      currentPage() {
        this.getCurrentPage();
      }
    }
  }
</script>


<style>
.list {
  position: relative;
  max-width: 420px;
  margin: 0 auto;
}
</style>