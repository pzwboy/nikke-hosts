export const metadata = {
  title: 'NIKKE 可用IP获取',
  description: '获取网游《胜利女神：妮姬》可用IP（而非国内直接访问解析成的0.0.0.1）并生成Hosts 由DeepSeek辅助制作',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body>
        {children}
      </body>
    </html>
  );
}