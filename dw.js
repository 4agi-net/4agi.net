import crypto from 'node:crypto';
import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 将异步函数转换为Promise
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

// 配置文件路径
const rootDir = path.join(__dirname, './content/posts');
const mdFilePath = path.join(rootDir, './4.pratices-of-cursor.md');
const assetsDir = path.join(rootDir, './assets');

// 生成随机文件名
function generateRandomFileName(ext) {
  return crypto.randomBytes(8).toString('hex') + ext;
}

// 从URL中提取文件扩展名
function getExtensionFromUrl(url) {
  const parsedUrl = new URL(url);
  const pathname = parsedUrl.pathname;
  const ext = path.extname(pathname).toLowerCase() || '.jpg'; // 默认为.jpg
  return ext;
}

// 下载图片
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`下载失败，状态码: ${response.statusCode}`));
        return;
      }

      const ext = getExtensionFromUrl(url);
      const fileName = generateRandomFileName(ext);
      const filePath = path.join(assetsDir, fileName);
      const fileStream = fs.createWriteStream(filePath);

      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve({
          originalUrl: url,
          fileName,
          localPath: `./assets/${fileName}`,
        });
      });

      fileStream.on('error', (err) => {
        fs.unlink(filePath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// 正则表达式匹配markdown中的图片链接
const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;

// 主函数
async function main() {
  try {
    // 确保assets目录存在
    try {
      await mkdir(assetsDir, { recursive: true });
      console.warn(`已创建目录：${assetsDir}`);
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }

    // 读取md文件内容
    const mdContent = await readFile(mdFilePath, 'utf8');
    console.warn('已读取Markdown文件');

    // 找到所有图片链接
    const matches = [...mdContent.matchAll(imageRegex)];
    if (matches.length === 0) {
      console.warn('没有找到外链图片');
      return;
    }

    console.warn(`找到 ${matches.length} 个图片链接`);

    // 保存下载任务
    const downloadTasks = [];
    const imageUrls = new Set();

    // 收集需要下载的图片URL
    for (const match of matches) {
      const imageUrl = match[2];

      // 只处理外链图片（以http或https开头）
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        imageUrls.add(imageUrl);
      }
    }

    console.warn(`需要下载 ${imageUrls.size} 个外链图片`);

    // 下载所有图片
    for (const imageUrl of imageUrls) {
      downloadTasks.push(downloadImage(imageUrl));
    }

    // 等待所有下载完成
    const downloadResults = await Promise.all(downloadTasks);
    console.warn('所有图片下载完成');

    // 创建URL映射
    const urlMap = {};
    downloadResults.forEach((result) => {
      urlMap[result.originalUrl] = result.localPath;
    });

    // 替换md文件中的图片链接
    let newMdContent = mdContent;
    for (const match of matches) {
      const altText = match[1];
      const imageUrl = match[2];

      // 检查是否为外链图片并且已下载
      if (urlMap[imageUrl]) {
        const originalText = `![${altText}](${imageUrl})`;
        const replacementText = `![${altText}](${urlMap[imageUrl]})`;
        newMdContent = newMdContent.replace(originalText, replacementText);
      }
    }

    // 写入更新后的md文件
    await writeFile(mdFilePath, newMdContent, 'utf8');
    console.warn('Markdown文件已更新');

    console.warn('处理完成！');
    console.warn(`已下载 ${downloadResults.length} 个图片到 ${assetsDir}`);
  } catch (error) {
    console.error('错误:', error);
  }
}

// 执行主函数
main();
