# 站点展示数据

默认演示数据已清空，请通过页面管理入口添加，或按以下格式创建数据文件：

- `projects.yaml`：项目列表。每项填写 `name`、`avatar`、`description`、`url`、`tags`；可选 `year`、`github`、`npm`、`badge`。
- `friends.yaml`：友链列表。每项填写 `name`、`avatar`、`description`、`url`；可选 `badge`。
- `navigation.yaml`：导航分类。每个分类填写 `title`、`icon`、`items`；每个项目填写 `name`、`avatar`、`description`、`url`、`category`。
- `albums.json`：相册列表。每项填写 `id`、`date`、`event`、`title`、`photos`；每张照片填写 `src` 和 `variant`。
- `music.json`：自定义歌单缓存，初始结构为 `songs`、`playlistCounts`、`playlistSongs` 三个空对象/数组。

使用各页面的编辑按钮保存内容时，文件会自动创建。
