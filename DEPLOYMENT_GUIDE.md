# SaforaTech — সম্পূর্ণ ডেপ্লয়মেন্ট গাইড
# Full Deployment Guide (Bengali + English)

---

## 📁 প্রজেক্ট স্ট্রাকচার / Project Structure

```
saforatech/
├── main.py                    # FastAPI entry point
├── requirements.txt           # Python dependencies
├── app/
│   └── routers/
│       ├── admin.py           # Admin panel routes
│       └── api.py             # REST API routes
├── templates/
│   ├── base.html              # Base template (navbar, footer)
│   ├── index.html             # Homepage
│   ├── about.html             # About page
│   ├── services.html          # Services page
│   ├── pricing.html           # Pricing page
│   ├── blog.html              # Blog page
│   ├── contact.html           # Contact page
│   └── admin/
│       ├── login.html         # Admin login
│       └── dashboard.html     # Admin dashboard
├── static/
│   ├── css/
│   │   ├── main.css           # Main stylesheet
│   │   └── admin.css          # Admin styles
│   └── js/
│       └── main.js            # JS (dark mode, lang, interactions)
├── deployment/
│   ├── nginx.conf             # Nginx config (all domains + subdomains)
│   └── saforatech.service     # Systemd service
└── .github/
    └── workflows/
        └── deploy.yml         # GitHub Actions CI/CD
```

---

## 🖥️ STEP 1: Mac-এ লোকাল ডেভেলপমেন্ট সেটআপ

```bash
# 1. VS Code-এ প্রজেক্ট খুলুন
cd ~/Desktop
mkdir saforatech && cd saforatech

# 2. Python Virtual Environment তৈরি করুন
python3 -m venv venv
source venv/bin/activate

# 3. Dependencies ইন্সটল করুন
pip install -r requirements.txt

# 4. সার্ভার চালু করুন
uvicorn main:app --reload --port 8000

# 5. Browser-এ দেখুন
# http://localhost:8000
```

---

## 🐙 STEP 2: GitHub-এ Push করুন

```bash
# প্রজেক্টের ভেতরে থেকে:
git init
git remote add origin https://github.com/smmoinul/saforatech-website.git
git add .
git commit -m "🚀 Initial SaforaTech website"
git branch -M main
git push -u origin main
```

---

## 🌐 STEP 3: VPS সার্ভার প্রস্তুত করুন

### ৩.১ — VPS কিনুন
সাশ্রয়ী VPS অপশন (Ubuntu 22.04 LTS):
- **DigitalOcean** — $6/month (1GB RAM)
- **Vultr** — $6/month
- **Hostinger VPS** — সবচেয়ে সস্তা বাংলাদেশ থেকে
- **Contabo** — $5/month (ভালো পারফরমেন্স)

### ৩.২ — VPS-এ সংযুক্ত হন (Mac Terminal)
```bash
ssh root@YOUR_VPS_IP
```

### ৩.৩ — সার্ভার সেটআপ স্ক্রিপ্ট চালান
```bash
# আপডেট করুন
apt update && apt upgrade -y

# প্রয়োজনীয় প্যাকেজ
apt install -y python3 python3-pip python3-venv nginx certbot \
              python3-certbot-nginx git ufw

# Firewall সেটআপ
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable

# প্রজেক্ট ডিরেক্টরি তৈরি
mkdir -p /var/www/saforatech
cd /var/www/saforatech

# GitHub থেকে Clone করুন
git clone https://github.com/smmoinul/saforatech-website.git .

# Virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Permission ঠিক করুন
chown -R www-data:www-data /var/www/saforatech
```

### ৩.৪ — Systemd Service সেটআপ
```bash
# Service ফাইল কপি করুন
cp /var/www/saforatech/deployment/saforatech.service /etc/systemd/system/

# Service চালু করুন
systemctl daemon-reload
systemctl enable saforatech
systemctl start saforatech

# স্ট্যাটাস চেক করুন
systemctl status saforatech
```

### ৩.৫ — Nginx সেটআপ
```bash
# Nginx config কপি করুন
cp /var/www/saforatech/deployment/nginx.conf /etc/nginx/sites-available/saforatech

# Enable করুন
ln -s /etc/nginx/sites-available/saforatech /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default  # default মুছুন

# টেস্ট করুন
nginx -t

# Restart করুন
systemctl restart nginx
```

---

## 🔒 STEP 4: SSL Certificate (HTTPS) — Cloudflare থেকে

### অপশন A: Cloudflare Proxy দিয়ে (সহজ — Recommended)

Cloudflare dashboard → **SSL/TLS** → "Full (strict)" সেট করুন।
Nginx-এ SSL লাগবে না, Cloudflare নিজেই handle করে।

### অপশন B: Let's Encrypt Certificate

```bash
# SSL Certificate নিন
certbot --nginx -d saforatech.com -d www.saforatech.com

# .bd domain-এর জন্যও নিন (যখন কিনবেন)
certbot --nginx -d saforatech.com.bd -d www.saforatech.com.bd

# Wildcard (সব subdomain-এর জন্য) — DNS challenge দরকার
certbot certonly --manual --preferred-challenges dns \
  -d saforatech.com -d *.saforatech.com
# Cloudflare-এ TXT record যোগ করতে বলবে

# Auto-renewal চেক করুন
certbot renew --dry-run
```

---

## 🌍 STEP 5: Cloudflare DNS সেটআপ

### saforatech.com এর জন্য DNS Records:

| Type  | Name              | Value (VPS IP)   | Proxy    |
|-------|-------------------|-----------------|----------|
| A     | @                 | YOUR_VPS_IP     | ✅ ON    |
| A     | www               | YOUR_VPS_IP     | ✅ ON    |
| A     | erp               | YOUR_VPS_IP     | ✅ ON    |
| A     | aishikhi          | YOUR_VPS_IP     | ✅ ON    |
| A     | moinul            | YOUR_VPS_IP     | ✅ ON    |
| CNAME | mail              | ghs.google.com  | ❌ OFF   |

**গুরুত্বপূর্ণ:**
- Proxy (কমলা মেঘ) ON থাকলে Cloudflare-এর SSL কাজ করে
- Mail records-এ Proxy OFF রাখতে হবে

---

## 🇧🇩 STEP 6: saforatech.com.bd ডোমেইন সেটআপ

### বাংলাদেশ সরকার রেজিস্ট্রার থেকে কেনার পর:
১. `.bd` ডোমেইনের Nameserver পরিবর্তন করুন Cloudflare-এর nameserver-এ
২. Cloudflare-এ `saforatech.com.bd` যোগ করুন (Add Site)
৩. একই DNS records যোগ করুন
৪. nginx.conf-এ `saforatech.com.bd` redirect already configured আছে → `saforatech.com`-এ redirect হবে

---

## 🔄 STEP 7: GitHub Actions CI/CD সেটআপ

### GitHub Repository Secrets যোগ করুন:
**Settings → Secrets and variables → Actions → New repository secret**

| Secret Name   | Value                    |
|--------------|--------------------------|
| VPS_HOST     | YOUR_VPS_IP              |
| VPS_USER     | root (বা ubuntu)        |
| VPS_SSH_KEY  | আপনার private SSH key   |
| VPS_PORT     | 22                       |

### SSH Key তৈরি করুন (Mac Terminal):
```bash
# Key তৈরি করুন
ssh-keygen -t ed25519 -C "saforatech-deploy" -f ~/.ssh/saforatech_deploy

# Public key VPS-এ যোগ করুন
ssh-copy-id -i ~/.ssh/saforatech_deploy.pub root@YOUR_VPS_IP

# Private key GitHub Secret-এ দিন
cat ~/.ssh/saforatech_deploy  # এটা কপি করে GitHub-এ paste করুন
```

### এখন থেকে:
```bash
git add .
git commit -m "Update website"
git push origin main
# ↑ এটা করলে GitHub Actions auto-deploy করবে!
```

---

## 📊 STEP 8: Subdomain প্রজেক্টগুলো

### aishikhi.saforatech.com
```bash
# আলাদা প্রজেক্ট হিসেবে তৈরি করুন
mkdir -p /var/www/aishikhi
# Port 8002-এ রান করুন
# Nginx already configured for port 8002
```

### erp.saforatech.com
```bash
mkdir -p /var/www/erp
# Port 8001-এ রান করুন
# Nginx already configured for port 8001
```

### moinul.saforatech.com (Personal Portfolio)
```bash
mkdir -p /var/www/moinul-portfolio
# Port 8003-এ রান করুন
# Nginx already configured for port 8003
```

---

## 🔧 দরকারী Commands

```bash
# লগ দেখুন
journalctl -u saforatech -f

# সার্ভিস রিস্টার্ট করুন
systemctl restart saforatech

# Nginx রিস্টার্ট করুন
systemctl restart nginx

# সার্ভিস স্ট্যাটাস
systemctl status saforatech
systemctl status nginx

# Disk space চেক
df -h

# Memory চেক
free -h

# Running processes
htop
```

---

## 🛡️ Admin Panel

**URL:** `https://saforatech.com/admin/`
- **Username:** admin
- **Password:** saforatech2025 (production-এ অবশ্যই পরিবর্তন করুন!)

`app/routers/admin.py`-এ password পরিবর্তন করুন:
```python
ADMIN_USER = "admin"
ADMIN_PASS = "আপনার_নতুন_পাসওয়ার্ড"
```

---

## 📱 VS Code Extensions (Mac)

```
- Python (Microsoft)
- Pylance
- Jinja (samuelcolvin)
- HTML CSS Support
- Better Jinja
- GitLens
- GitHub Copilot (optional)
```

---

## ✅ Quick Checklist

- [ ] Mac-এ লোকাল রান হচ্ছে (`localhost:8000`)
- [ ] GitHub-এ push হয়েছে
- [ ] VPS কেনা হয়েছে
- [ ] সার্ভারে clone + venv + pip install হয়েছে
- [ ] Systemd service চালু আছে
- [ ] Nginx configure হয়েছে
- [ ] Cloudflare DNS records যোগ হয়েছে
- [ ] SSL certificate নেওয়া হয়েছে
- [ ] GitHub Secrets যোগ হয়েছে
- [ ] Auto-deploy টেস্ট করা হয়েছে
- [ ] Admin panel accessible
- [ ] saforatech.com.bd redirect কাজ করছে

---

**Made with ❤️ for SaforaTech — Khulna, Bangladesh 🇧🇩**
