# 進到專案 PDF_tool 資料夾（視你路徑調整）
cd /Users/huangwei/Project/Javascript/PDF_tool/lib

# 用 curl 下載（-L 追蹤 redirect）
curl -L "https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js" -o pdf-lib.min.js
curl -L "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js" -o jszip.min.js
curl -L "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js" -o pdf.min.js
curl -L "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js" -o pdf.worker.min.js



# 驗證檔案不是 HTML（第一行不應為 '<'）
head -n 1 pdf-lib.min.js
head -n 1 jszip.min.js
head -n 1 pdf.min.js
head -n 1 pdf.worker.min.js

# 檢查大小
ls -lh pdf-lib.min.js
ls -lh jszip.min.js
ls -lh pdf.min.js
ls -lh pdf.worker.min.js