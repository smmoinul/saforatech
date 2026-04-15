from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from app.routers import api
import uvicorn

app = FastAPI(
    title="SaforaTech",
    description="SaforaTech Official Website",
    # Disable automatic trailing slash redirect
    redirect_slashes=False
)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")
app.include_router(api.router, prefix="/api")

T = templates

def render(tmpl, req, **ctx):
    return T.TemplateResponse(tmpl, {"request": req, **ctx})

# ══ PUBLIC PAGES ═════════════════════════════════════════════
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return render("index.html", request)

@app.get("/about", response_class=HTMLResponse)
async def about(request: Request):
    return render("about.html", request)

@app.get("/services", response_class=HTMLResponse)
async def services(request: Request):
    return render("services.html", request)

@app.get("/pricing", response_class=HTMLResponse)
async def pricing(request: Request):
    return render("pricing.html", request)

@app.get("/blog", response_class=HTMLResponse)
async def blog(request: Request):
    return render("blog.html", request)

@app.get("/blog/new", response_class=HTMLResponse)
async def blog_new(request: Request):
    return render("blog_new.html", request)

@app.get("/blog/{slug}", response_class=HTMLResponse)
async def blog_post(request: Request, slug: str):
    return render("blog_post.html", request, slug=slug)

@app.get("/contact", response_class=HTMLResponse)
async def contact(request: Request):
    return render("contact.html", request)

@app.get("/dashboard", response_class=HTMLResponse)
async def user_dashboard(request: Request):
    return render("dashboard.html", request)

# ══ AUTH ═════════════════════════════════════════════════════
@app.get("/auth/callback", response_class=HTMLResponse)
async def auth_callback(request: Request):
    return render("auth_callback.html", request)

@app.get("/auth/reset-password", response_class=HTMLResponse)
async def reset_password(request: Request):
    return render("auth_reset.html", request)

# ══ ADMIN CPANEL ═════════════════════════════════════════════
# Handle both /admin and /admin/ → dashboard
@app.get("/admin", response_class=HTMLResponse)
async def admin_root(request: Request):
    return render("admin/dashboard.html", request)

@app.get("/admin/", response_class=HTMLResponse)
async def admin_index(request: Request):
    return render("admin/dashboard.html", request)

@app.get("/admin/posts", response_class=HTMLResponse)
async def admin_posts(request: Request):
    return render("admin/posts.html", request)

@app.get("/admin/posts/new", response_class=HTMLResponse)
async def admin_post_new(request: Request):
    return render("admin/post_editor.html", request, post_id=None)

@app.get("/admin/posts/edit/{post_id}", response_class=HTMLResponse)
async def admin_post_edit(request: Request, post_id: str):
    return render("admin/post_editor.html", request, post_id=post_id)

@app.get("/admin/messages", response_class=HTMLResponse)
async def admin_messages(request: Request):
    return render("admin/messages.html", request)

@app.get("/admin/services-manage", response_class=HTMLResponse)
async def admin_services(request: Request):
    return render("admin/services_manage.html", request)

@app.get("/admin/testimonials", response_class=HTMLResponse)
async def admin_testimonials(request: Request):
    return render("admin/testimonials.html", request)

@app.get("/admin/users", response_class=HTMLResponse)
async def admin_users(request: Request):
    return render("admin/users.html", request)

@app.get("/admin/comments", response_class=HTMLResponse)
async def admin_comments(request: Request):
    return render("admin/comments.html", request)

@app.get("/admin/pages", response_class=HTMLResponse)
async def admin_pages(request: Request):
    return render("admin/pages.html", request)

@app.get("/admin/appearance", response_class=HTMLResponse)
async def admin_appearance(request: Request):
    return render("admin/appearance.html", request)

@app.get("/admin/settings", response_class=HTMLResponse)
async def admin_settings(request: Request):
    return render("admin/settings.html", request)

@app.get("/admin/login", response_class=HTMLResponse)
async def admin_login(request: Request):
    return render("admin/login.html", request)

# ══ API ═══════════════════════════════════════════════════════
@app.post("/api/contact")
async def submit_contact(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(""),
    subject: str = Form(""),
    message: str = Form(...)
):
    return JSONResponse({"success": True, "message": "Message received!"})

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
