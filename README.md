# 你的專屬收納盒 · 30 款配色

給兩個人一起挑選收納盒顏色的輕量網站。

## 使用方式

- 30 款配色都能點開看大圖與各零件用色。
- 按愛心收藏喜歡的款式，再切到「我的收藏」比較。
- 「傳送選色」可以複製清單、複製選色連結，或使用手機的分享功能。
- 分享連結含選中的款式編號，對方打開後會直接看到這份清單。
- 收藏保存在目前瀏覽器；沒有帳號、資料庫或自動傳送功能。

## GitHub Pages 上傳方式

已建立的專案：https://github.com/sianromantic/makeup-color-picker

1. 將網站 ZIP 解壓縮。
2. 打開上方已建立的 `sianromantic/makeup-color-picker` 專案。
3. 空白專案可按 **uploading an existing file**；若已有檔案則用 **Add file → Upload files**。將本資料夾內的所有檔案與 `assets` 資料夾一起拖入網頁並提交。不要上傳 ZIP 本身，也不要讓 `index.html` 多包一層資料夾。
4. 前往 **Settings → Pages**。
5. **Source** 選 **Deploy from a branch**，分支選 `main`，資料夾選 `/(root)`，然後按 **Save**。
6. 等待 Pages 部署完成，把 Pages 顯示的網址傳給對方。

此網站可直接以靜態檔案部署，不需要 npm、建置指令或環境變數。GitHub Pages 開啟後，網站及其圖片可由公開網址瀏覽。

GitHub 官方說明：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 檔案

- `index.html`：網站首頁。
- `styles.css`：手機與桌面版樣式。
- `app.js`：收藏、大圖與分享功能。
- `colors.js`：30 款配色及材料對照。
- `assets/`：30 張完整 WebP 圖與 30 張縮圖，約 3.8 MB。
- `.nojekyll`：讓 GitHub Pages 直接提供靜態檔案。

所有路徑均為相對路徑，可部署在 GitHub project Pages 子路徑。直接在電腦開啟 `index.html` 也能瀏覽；可分享的選色連結需在 HTTP(S) 網址下使用。

圖片為依使用者提供的模型與線材色表製作的 AI 配色示意。實際列印色澤、透明度及部分細節可能不同。原始 3MF 不包含在本網站內。
