export const metadata = {
  title: 'NIKKE服务器可用IP获取',
  description: '获取《胜利女神：妮姬》可用登录IP并生成Hosts',
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