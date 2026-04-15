from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

router = APIRouter()
templates = Jinja2Templates(directory="templates")

def r(tmpl, request, **ctx):
    return templates.TemplateResponse(tmpl, {"request": request, **ctx})

# ── Dashboard ────────────────────────────────────────────────
@router.get("/", response_class=HTMLResponse)
async def dashboard(request: Request):
    return r("admin/dashboard.html", request)

# ── Blog Posts ───────────────────────────────────────────────
@router.get("/posts", response_class=HTMLResponse)
async def posts(request: Request):
    return r("admin/posts.html", request)

@router.get("/posts/new", response_class=HTMLResponse)
async def post_new(request: Request):
    return r("admin/post_editor.html", request, post_id=None)

@router.get("/posts/edit/{post_id}", response_class=HTMLResponse)
async def post_edit(request: Request, post_id: str):
    return r("admin/post_editor.html", request, post_id=post_id)

# ── Messages ─────────────────────────────────────────────────
@router.get("/messages", response_class=HTMLResponse)
async def messages(request: Request):
    return r("admin/messages.html", request)

# ── Services ─────────────────────────────────────────────────
@router.get("/services-manage", response_class=HTMLResponse)
async def services_manage(request: Request):
    return r("admin/services_manage.html", request)

# ── Testimonials ─────────────────────────────────────────────
@router.get("/testimonials", response_class=HTMLResponse)
async def testimonials(request: Request):
    return r("admin/testimonials.html", request)

# ── Users ────────────────────────────────────────────────────
@router.get("/users", response_class=HTMLResponse)
async def users(request: Request):
    return r("admin/users.html", request)

# ── Comments ─────────────────────────────────────────────────
@router.get("/comments", response_class=HTMLResponse)
async def comments(request: Request):
    return r("admin/comments.html", request)

# ── Pages ────────────────────────────────────────────────────
@router.get("/pages", response_class=HTMLResponse)
async def pages(request: Request):
    return r("admin/pages.html", request)

# ── Appearance ───────────────────────────────────────────────
@router.get("/appearance", response_class=HTMLResponse)
async def appearance(request: Request):
    return r("admin/appearance.html", request)

# ── Settings ─────────────────────────────────────────────────
@router.get("/settings", response_class=HTMLResponse)
async def settings(request: Request):
    return r("admin/settings.html", request)

# ── Login ────────────────────────────────────────────────────
@router.get("/login", response_class=HTMLResponse)
async def login(request: Request):
    return r("admin/login.html", request)
