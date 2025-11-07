const dns = require('dns').promises;
const fs = require('fs').promises;
const path = require('path');

const domains = [
  'hmt-lobby.nikke-kr.com',
  'nikke-en.com', 
  'cloud.nikke-kr.com'
];

async function resolveIP(domain) {
  try {
    const addresses = await dns.resolve4(domain);
    return addresses[0] || '无法解析IP';
  } catch (error) {
    console.error(`解析 ${domain} 时出错:`, error.message);
    
    if (error.code === 'ENOTFOUND') {
      return '域名不存在';
    } else if (error.code === 'ETIMEOUT') {
      return 'DNS查询超时';
    } else {
      return `解析失败: ${error.code}`;
    }
  }
}

/**
 * 生成标准hosts文件内容
 */
function generateHostsContent(ip001, ip002, ip003) {
  return `${ip001} jp-lobby.nikke-kr.com
${ip001} kr-lobby.nikke-kr.com
${ip001} global-lobby.nikke-kr.com
${ip001} sea-lobby.nikke-kr.com
${ip001} hmt-lobby.nikke-kr.com
${ip001} jp-match.nikke-kr.com
${ip001} kr-match.nikke-kr.com
${ip001} global-match.nikke-kr.com
${ip001} sea-match.nikke-kr.com
${ip001} hmt-match.nikke-kr.com
${ip002} nikke-en.com
${ip002} nikke-kr.com
${ip002} nikke-jp.com
${ip003} cloud.nikke-kr.com`;
}

/**
 * 生成iOS Shadowrocket格式的hosts文件内容
 */
function generateHostsIOSContent(ip001, ip002, ip003) {
  return `[Host]
jp-lobby.nikke-kr.com = ${ip001}
kr-lobby.nikke-kr.com = ${ip001}
global-lobby.nikke-kr.com = ${ip001}
sea-lobby.nikke-kr.com = ${ip001}
hmt-lobby.nikke-kr.com = ${ip001}
jp-match.nikke-kr.com = ${ip001}
kr-match.nikke-kr.com = ${ip001}
global-match.nikke-kr.com = ${ip001}
sea-match.nikke-kr.com = ${ip001}
hmt-match.nikke-kr.com = ${ip001}
nikke-en.com = ${ip002}
nikke-kr.com = ${ip002}
nikke-jp.com = ${ip002}
cloud.nikke-kr.com = ${ip003}`;
}

async function updateIPFiles() {
  const ipDir = path.join(process.cwd(), 'public', 'ip');
  
  // 确保ip目录存在
  try {
    await fs.access(ipDir);
  } catch {
    await fs.mkdir(ipDir, { recursive: true });
  }

  const results = [];
  const updateTime = new Date();
  
  // 格式化时间字符串
  const timeString = updateTime.toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  // 写入更新时间文件
  const timeFilePath = path.join(ipDir, 'time.txt');
  await fs.writeFile(timeFilePath, timeString, 'utf8');
  
  console.log(`开始更新IP文件，时间: ${timeString}`);
  
  // 更新IP文件
  const ipAddresses = {};
  
  for (let i = 0; i < domains.length; i++) {
    const domain = domains[i];
    console.log(`正在解析域名: ${domain}`);
    
    const ip = await resolveIP(domain);
    const fileName = `00${i + 1}.txt`.slice(-7);
    const filePath = path.join(ipDir, fileName);
    
    await fs.writeFile(filePath, ip, 'utf8');
    results.push({
      domain,
      ip,
      file: fileName
    });
    
    // 存储IP地址用于生成hosts文件
    ipAddresses[fileName] = ip;
    
    console.log(`域名 ${domain} -> IP: ${ip} -> 文件: ${fileName}`);
  }
  
  // 获取IP地址
  const ip001 = ipAddresses['001.txt'] || '43.174.250.69';
  const ip002 = ipAddresses['002.txt'] || '38.60.181.168';
  const ip003 = ipAddresses['003.txt'] || '108.156.144.59';
  
  // 生成并写入hosts.txt文件（标准格式）
  const hostsContent = generateHostsContent(ip001, ip002, ip003);
  const hostsFilePath = path.join(ipDir, 'hosts.txt');
  await fs.writeFile(hostsFilePath, hostsContent, 'utf8');
  console.log('✅ hosts.txt 文件已生成');
  
  // 生成并写入hosts-ios.txt文件（iOS Shadowrocket格式）
  const hostsIOSContent = generateHostsIOSContent(ip001, ip002, ip003);
  const hostsIOSFilePath = path.join(ipDir, 'hosts-ios.txt');
  await fs.writeFile(hostsIOSFilePath, hostsIOSContent, 'utf8');
  console.log('✅ hosts-ios.txt 文件已生成');
  
  console.log('所有IP文件更新完成');
  
  return {
    results,
    updateTime: timeString,
    timestamp: updateTime.toISOString(),
    totalDomains: domains.length,
    successful: results.filter(r => !r.ip.includes('失败') && !r.ip.includes('无法解析')).length,
    hostsGenerated: true,
    hostsIOSGenerated: true
  };
}

module.exports = { 
  updateIPFiles, 
  domains
};