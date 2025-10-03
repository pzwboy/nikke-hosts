'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [ipData, setIpData] = useState([]);
  const [updateTime, setUpdateTime] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchIPData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ip');
      const data = await response.json();
      
      if (data.success) {
        setIpData(data.results || data.data);
        setUpdateTime(data.updateTime);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIPData();
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.background}></div>
        <div style={styles.content}>
          <h1 style={styles.title}>NIKKE服务器可用IP获取</h1>
          <p style={styles.loading}>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.background}></div>
      <div style={styles.content}>
        <h1 style={styles.title}>NIKKE服务器可用IP获取</h1>
        <p style={styles.subtitle}>获取《胜利女神：妮姬》可用登录IP并生成Hosts</p>
        
        {updateTime && (
          <div style={styles.updateTime}>
            最后更新时间: {updateTime}
          </div>
        )}

        <div style={styles.ipList}>
          {ipData.map((item, index) => (
            <div key={index} style={styles.ipItem}>
              <div style={styles.domain}>{item.domain}</div>
              <div style={styles.ip}>{item.ip}</div>
              <div style={styles.file}>
                <a href={`/ip/${item.file}`} target="_blank" rel="noopener noreferrer">{item.file}</a>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.links}>
          <a href="/ip/hosts.txt" target="_blank" rel="noopener noreferrer">Hosts</a> | 
          <a href="/ip/hosts-ios.txt" target="_blank" rel="noopener noreferrer"> Hosts (iOS)</a> | 
          <a href="/ip/time.txt" target="_blank" rel="noopener noreferrer"> 更新时间</a><br />
          <a href="https://pzwboy.top/file/nikkehosts/nikke_hosts.exe" target="_blank" rel="noopener noreferrer">下载 NIKKE Hosts 写入工具</a> (Windows)
        </div>

        <div style={styles.footer}>
          © 2021-2025 Pzwboy.
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    minHeight: '100vh',
    width: '100%'
  },
  background: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url("/snow_white_c.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    filter: 'brightness(0.3)',
    zIndex: -1
  },
  content: {
    position: 'relative',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    color: 'white',
    zIndex: 1
  },
  title: {
    marginBottom: '15px',
    color: 'white',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
  },
  subtitle: {
    marginBottom: '30px',
    color: '#e0e0e0',
    fontSize: '1.1rem',
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
  },
  loading: {
    color: '#e0e0e0',
    marginTop: '50px',
    fontSize: '1.2rem'
  },
  updateTime: {
    marginBottom: '30px',
    color: '#e0e0e0',
    fontSize: '1.1rem',
    backgroundColor: 'rgba(0, 112, 243, 0.3)',
    padding: '15px',
    borderRadius: '10px',
    backdropFilter: 'blur(10px)'
  },
  ipList: {
    marginBottom: '40px'
  },
  ipItem: {
    marginBottom: '25px',
    padding: '20px',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '10px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  },
  domain: {
    fontWeight: 'bold',
    marginBottom: '8px',
    fontSize: '1.1rem',
    color: 'white'
  },
  ip: {
    fontFamily: 'monospace',
    fontSize: '1.3rem',
    marginBottom: '8px',
    color: '#4fc3f7',
    fontWeight: 'bold'
  },
  file: {
    fontSize: '0.9rem',
    color: '#b0bec5'
  },
  links: {
    marginBottom: '25px',
    color: '#e0e0e0',
    fontSize: '1rem'
  },
  footer: {
    color: '#b0bec5',
    fontSize: '0.9rem'
  }
};

// 添加悬停效果
const addHoverEffects = `
  .ip-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    border-color: rgba(255,255,255,0.4);
  }
  
  a {
    color: #4fc3f7;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  a:hover {
    color: #29b6f6;
    text-decoration: underline;
  }
`;

// 在组件中注入样式
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = addHoverEffects;
  document.head.appendChild(style);
}