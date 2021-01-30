<template>
  <div class="bg">
        <!-- 編集 -->
        <onoff-toggle v-model="checked" theme="material" />
        <br>
        <button v-on:click="exportCSV">
            エクスポート
        </button>
        <br>
        <button v-on:click="addtask">
            追加
        </button>
        <br>
        <input @change="csvUpload" type="file">
        <br>
        <br>
        <!-- 本文 -->
        <table class="table" border="1">
            <!-- カラム名部分 -->
            <thead>
                <tr>
                    <th>コメント</th>
                    <th>削除</th>
                </tr>
            </thead>

            <!-- コメント表示部分 -->
            <tbody>
                <tr v-for="(item,index) in items" :key="index">
                    <td>
                        <input ref="focusComment" type="text" class="form-control" v-model="item.comment" v-if="checked"
                            @keyup.enter="keyup_enter(index)" @keypress.enter="keypress_enter(index)"
                            @keydown.prevent.down="moveNextComment(index)" @keydown.prevent.up="movePrevComment(index)">
                        <input ref="focusComment" type="text" class="form-control" v-model="item.comment" v-else
                            @keyup.enter="keyup_enter(index)" @keypress.enter="keypress_enter(index)"
                            @keydown.prevent.down="moveNextComment(index)" @keydown.prevent.up="movePrevComment(index)" readonly=true>
                    </td>
                    <td>
                        <button v-on:click=" deletetask(index)" v-if="checked">削除</button>
                        <button v-on:click=" deletetask(index)" v-else disabled>削除</button>
                    </td>
                </tr>
            </tbody>
        </table>
  </div>
</template>

<script>
import csvUpload from '../components/csvUpload'

export default {
  data () {
    return {
      items: [{
        comment: ''
      }],
      checked: false
    }
  },
  mounted () {
    if (localStorage.koutei_pengin_items !== undefined) {
      const itemlist = localStorage.koutei_pengin_items.split(',')
      for (let index = 0; index < itemlist.length - 2; index++) {
        this.items[index].comment = itemlist[index]
        this.addtask()
      }
    }
  },
  watch: {
    items (newItems) {
      let comment = ''
      for (var index = 0; index < this.items.length; index++) {
        comment += newItems[index].comment + ','
      }
      localStorage.koutei_pengin_items = comment
    }
  },
  methods: {
    exportCSV () {
      /**
       * 押下時に、今表示されている
       */
      var csv = '\ufeff' + 'comment\n'
      this.items.forEach(el => {
        var line = el.comment + '\n'
        csv += line
      })
      const blob = new Blob([csv], {
        type: 'text/csv'
      })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = 'koutei-pengin_memo.csv'
      link.click()
    },
    addtask () {
      var task = {
        comment: '',
        enable: false
      }
      this.items.push(task)
    },
    deletetask (row) {
      this.items.splice(row, 1)
    },
    keyup_enter () {

    },
    keypress_enter (index) {
      if (this.keyup_enter(index)) {
        return
      }

      var fil = this.items.filter(x => x.comment === '')
      if (fil.length === 0) {
        this.addtask()
      }
    },
    moveNextComment (index) {
      /**
       * カーソルで下を押下した際に下のテキストボックスに移動する。
       */
      if (this.items.length - 1 === index) {
        this.$refs.focusComment[0].focus()
        this.$refs.focusComment[0].select()
      } else {
        this.$refs.focusComment[index + 1].focus()
        this.$refs.focusComment[index + 1].select()
      }
    },
    movePrevComment (index) {
      /**
       * カーソルで上を押下した際に上のテキストボックスに移動する。
       */
      if (index === 0) {
        this.$refs.focusComment[this.items.length - 1].focus()
        this.$refs.focusComment[this.items.length - 1].select()
      } else {
        this.$refs.focusComment[index - 1].focus()
        this.$refs.focusComment[index - 1].select()
      }
    },
    async csvUpload (event) {
      /**
         * csvのアップロード
         *  TODO 理解していない
         */
      const res = await csvUpload.csvUpload(event)
      if (res[0]) {
        // オブジェクトのコメントをitemsに移し替える
        this.items.splice(0, this.items.length)
        for (let index = 0; index < res[1].length - 1; index++) {
          if (this.items.length - 1 < index) {
            this.addtask()
          }
          this.items[index].comment = res[1][index].comment
        }
      } else {
        alert(res[1])
      }
    },
    convertCsvStringToArray (str) {
    /**
     * これなんのために作ったんだっけ？w
     */
      return str.split('\n').map(s => s.split(','))
    }
  }
}
</script>

<style>
  .bg {
    background-image: url("~@/assets/hyouga_500.png");
  }
</style>
