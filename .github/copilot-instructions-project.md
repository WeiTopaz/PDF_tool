# PDF Tool 專案的 Copilot 指示

## 專案概述
這是一個純前端 PDF 操作工具，使用 JavaScript 程式庫在瀏覽器中完全處理檔案。支援合併、旋轉、分割、壓縮（圖片化/結構化）、插入頁面，並包含免責聲明。所有操作都是本機端；無伺服器上傳。

**架構**：單一 HTML 檔案嵌入 CSS/JS。計劃重構為三層架構：UI（DOM 操作）、Application（事件處理）、Core-Utility（PDF 處理邏輯），以資料夾/模組邊界實現輕量 Clean。

**關鍵程式庫**：
- `pdf-lib`：核心 PDF 操作（合併、旋轉、分割、插入、結構壓縮）
- `pdf.js`：圖片化壓縮（將頁面轉換為影像）
- `jszip`：將多個輸出打包成 ZIP 檔案

## 開發者工作流程
- **開發**：直接編輯 `PDF_tool.html`；在現代瀏覽器（Chrome/Edge）中開啟測試。
- **測試**：透過 UI 手動測試；尚無自動化測試。驗證日誌顯示成功/失敗。
- **檔案處理**：使用 `FileReader.readAsArrayBuffer()` 讀取 PDF 輸入；建立 `Blob` URL 進行下載。
- **日誌記錄**：使用 `log(el, msg, type)` 提供 UI 回饋，帶有表情符號（✅/⚠️/❌/•）。

## 程式碼慣例
- **選擇器**：`$` 用於單一元素，`$$` 用於多個（例如 `$('#merge-run')`）。
- **檔案命名**：輸出遵循模式如 `merged.pdf`、`{original}-rotated.pdf`、`{original}-compressed-{dpi}-{quality}.pdf`。
- **錯誤處理**：將錯誤記錄到 UI；假設使用者處理檔案備份。
- **UI 一致性**：標籤控制面板；拖放區用於檔案輸入；晶片用於功能突出。
- **語言**：UI 使用繁體中文；註釋使用中文。

## 關鍵模式
- **PDF 處理**：使用 `PDFDocument.load(arrayBuffer)` 載入，操作頁面，儲存為 `Uint8Array`，透過 blob 下載。
- **範圍解析**：對於分割/插入，解析字串如 `1-3,5;8-10`（分號分組）。
- **壓縮權衡**：圖片化壓縮會失去文字/可搜尋性；結構化可能丟棄表單/註解。
- **插入頁面錯誤**：目前實作複製分割 UI/邏輯；修正以符合 [spec/spec.md](spec/spec.md) 要求（目標 PDF + 來源 PDF，位置選擇）。

## 整合點
- **瀏覽器 API**：檔案 API 用於上傳，URL.createObjectURL 用於下載。
- **限制揭露**：UI 必須警告圖片化壓縮副作用和不支援的 PDF 功能（加密、DRM）。
- **依賴項**：程式庫在 `lib/`；透過 [download .js.md](download .js.md) 中的 curl 命令更新。

參考 [spec/spec.md](spec/spec.md) 以取得詳細功能需求和重構目標。