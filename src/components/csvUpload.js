/* eslint-disable prefer-promise-reject-errors */
function checkFileReader () {
  return window.File && window.FileReader && window.FileList && window.Blob
}

export default {
  csvUpload (event) {
    return new Promise(function (resolve, reject) {
      // ブラウザチェック
      if (!checkFileReader()) {
        reject([false, 'FileAPI非対応のブラウザです。'])
      }

      const file = event.target.files[0]
      const reader = new FileReader()

      // ファイル読込完了
      const mailJson = []
      const loadFunc = () => {
        const lines = reader.result.split('\n')
        const header = lines[0].split(',')
        lines.shift()

        // 一行ずつ読込
        lines.forEach(eachLine => {
          const elements = eachLine.split(',')
          if (elements.length !== header.length) {
            return
          }

          // 一列ずつ読込
          const line = {}
          const zip = (array1, array2) => array1.map((_, i) => [array1[i], array2[i]])
          zip(header, elements).forEach(eachElement => {
            line[eachElement[0]] = eachElement[1]
          })

          mailJson.push(line)
        })
        resolve([true, mailJson])
      }
      reader.onload = loadFunc
      reader.onerror = () => {
        reject([false, 'ファイルの読込に失敗しました'])
      }
      reader.readAsText(file)
    })
  }
}
