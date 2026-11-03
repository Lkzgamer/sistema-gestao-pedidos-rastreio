const orders = [
  { id: "PED-2024-089", client: "Boutique Flor de Mandacaru", initials: "FM", product: "Vestido midi estampado", quantity: 50, dueDate: "2024-06-20", status: "Em produção", stage: "Costura", priority: "Alta" },
  { id: "PED-2024-088", client: "Armazém da Moda", initials: "AM", product: "Conjunto de linho", quantity: 30, dueDate: "2024-06-21", status: "Aguardando aprovação", stage: "Acabamento", priority: "Normal" },
  { id: "PED-2024-087", client: "Casa das Rendas", initials: "CR", product: "Blusa de renda renascença", quantity: 24, dueDate: "2024-06-22", status: "Em produção", stage: "Corte", priority: "Normal" },
  { id: "PED-2024-086", client: "Estilo Agreste", initials: "EA", product: "Saia longa floral", quantity: 40, dueDate: "2024-06-24", status: "Pronto para entrega", stage: "Pronto", priority: "Alta" },
  { id: "PED-2024-085", client: "Boutique Flor de Mandacaru", initials: "FM", product: "Camisa algodão cru", quantity: 60, dueDate: "2024-06-26", status: "Em produção", stage: "Costura", priority: "Normal" },
  { id: "PED-2024-084", client: "Moda Raiz", initials: "MR", product: "Conjunto cropped e short", quantity: 35, dueDate: "2024-06-27", status: "Entregue", stage: "Pronto", priority: "Normal" },
  { id: "PED-2024-083", client: "Armazém da Moda", initials: "AM", product: "Vestido de algodão", quantity: 28, dueDate: "2024-06-28", status: "Em produção", stage: "Acabamento", priority: "Normal" }
];

const avatarClasses = ["", "avatar-rose", "avatar-blue", "avatar-lilac", "avatar-green"];
const statusClasses = {
  "Em produção": "status-production",
  "Aguardando aprovação": "status-approval",
  "Pronto para entrega": "status-ready",
  Entregue: "status-delivered"
};
const pageNames = {
  painel: "Painel geral",
  cadastro: "Novo pedido",
  consulta: "Consultar pedidos",
  historico: "Histórico"
};
let toastTimer;

function formatDate(dateString) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" })
    .format(new Date(`${dateString}T12:00:00`))
    .replace(".", "");
}

function avatar(order, index) {
  return `<span class="client-avatar ${avatarClasses[index % avatarClasses.length]}">${order.initials}</span>`;
}

function statusBadge(status) {
  return `<span class="status ${statusClasses[status] || "status-production"}">${status}</span>`;
}

function renderDashboard() {
  const recentOrders = orders.slice(0, 4);
  document.querySelector("#dashboard-orders").innerHTML = recentOrders.map((order, index) => `
    <tr>
      <td><span class="order-id">${order.id}</span></td>
      <td><span class="client-cell">${avatar(order, index)}<strong>${order.client}</strong></span></td>
      <td>${order.product}</td>
      <td>${formatDate(order.dueDate)}</td>
      <td>${statusBadge(order.status)}</td>
    </tr>`).join("");

  document.querySelector("#delivery-list").innerHTML = orders
    .filter(order => order.status !== "Entregue")
    .slice(0, 3)
    .map(order => {
      const date = new Date(`${order.dueDate}T12:00:00`);
      return `<article class="delivery-item">
        <span class="delivery-date"><span>${new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(date).replace(".", "").toUpperCase()}</span><strong>${new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(date)}</strong></span>
        <span class="delivery-copy"><strong>${order.client}</strong><span>${order.product}</span></span>
      </article>`;
    }).join("");
}

function renderConsultation() {
  const query = document.querySelector("#order-search").value.trim().toLocaleLowerCase("pt-BR");
  const status = document.querySelector("#status-filter").value;
  const filtered = orders.filter(order => {
    const matchesText = [order.id, order.client, order.product].some(value =>
      value.toLocaleLowerCase("pt-BR").includes(query)
    );
    return matchesText && (!status || order.status === status);
  });
  const body = document.querySelector("#consultation-orders");
  body.innerHTML = filtered.length ? filtered.map((order, index) => `
    <tr>
      <td><span class="order-id">${order.id}</span></td>
      <td><span class="client-cell">${avatar(order, index)}<strong>${order.client}</strong></span></td>
      <td>${order.product}</td>
      <td>${order.quantity} peças</td>
      <td>${formatDate(order.dueDate)}</td>
      <td>${statusBadge(order.status)}</td>
      <td><button class="row-action" type="button" data-order="${order.id}" aria-label="Ver ${order.id}">···</button></td>
    </tr>`).join("") : `<tr><td class="empty-state" colspan="7">Nenhum pedido encontrado. Tente ajustar sua busca.</td></tr>`;
  document.querySelector("#results-count").textContent = `${filtered.length} ${filtered.length === 1 ? "pedido encontrado" : "pedidos encontrados"}`;
}

function renderTimeline() {
  const entries = [
    { day: "18 JUN", time: "Hoje, 10:42", icon: "↗", text: '<strong>Pedido PED-2024-089</strong> avançou para a etapa de costura.', badge: "Costura" },
    { day: "18 JUN", time: "Hoje, 09:15", icon: "◉", iconClass: "icon-approval", text: '<strong>Pedido PED-2024-088</strong> aguarda aprovação das amostras.', badge: "Aprovação" },
    { day: "17 JUN", time: "Ontem, 16:30", icon: "✓", iconClass: "icon-delivery", text: '<strong>Pedido PED-2024-084</strong> foi entregue ao cliente Moda Raiz.', badge: "Entregue" },
    { day: "17 JUN", time: "Ontem, 11:05", icon: "✂", text: '<strong>Pedido PED-2024-087</strong> iniciou a etapa de corte.', badge: "Corte" },
    { day: "14 JUN", time: "Sexta-feira, 14:20", icon: "＋", iconClass: "icon-delivery", text: '<strong>Novo pedido PED-2024-089</strong> cadastrado por Maria Almeida.', badge: "Novo pedido" }
  ];
  let currentDay = "";
  document.querySelector("#timeline").innerHTML = entries.map(entry => {
    const showDay = currentDay !== entry.day;
    currentDay = entry.day;
    return `<div class="timeline-group"><span class="timeline-marker"></span>
      ${showDay ? `<div class="timeline-date">${entry.day}</div>` : ""}
      <article class="timeline-entry">
        <span class="timeline-icon ${entry.iconClass || ""}">${entry.icon}</span>
        <div class="timeline-copy"><p>${entry.text}</p><small>${entry.time} · Maria Almeida</small></div>
        <span class="timeline-badge">${entry.badge}</span>
      </article>
    </div>`;
  }).join("");
}

function showView(viewName) {
  if (!pageNames[viewName]) return;
  document.querySelectorAll(".view").forEach(view => view.classList.toggle("active", view.id === `view-${viewName}`));
  document.querySelectorAll(".nav-link").forEach(link => {
    const isActive = link.dataset.view === viewName;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  document.querySelector("#breadcrumb-current").textContent = pageNames[viewName];
  document.querySelector("#sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 3200);
}

document.querySelectorAll("[data-view]").forEach(button => {
  button.addEventListener("click", () => showView(button.dataset.view));
});
document.querySelectorAll("[data-goto]").forEach(button => {
  button.addEventListener("click", () => showView(button.dataset.goto));
});
document.querySelector("#mobile-menu").addEventListener("click", () => {
  document.querySelector("#sidebar").classList.toggle("open");
});
document.querySelector("#order-search").addEventListener("input", renderConsultation);
document.querySelector("#status-filter").addEventListener("change", renderConsultation);
document.querySelector("#clear-filters").addEventListener("click", () => {
  document.querySelector("#order-search").value = "";
  document.querySelector("#status-filter").value = "";
  renderConsultation();
});
document.querySelector("#consultation-orders").addEventListener("click", event => {
  const button = event.target.closest("[data-order]");
  if (button) showToast(`${button.dataset.order}: acompanhamento detalhado estará disponível em uma próxima versão.`);
});
document.querySelector("#history-filter").addEventListener("click", () => {
  showToast("Exibindo atividades dos últimos 90 dias.");
});
document.querySelector("#order-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const fields = new FormData(form);
  const nextNumber = 90 + orders.filter(order => order.id.startsWith("PED-2024-")).length - 7;
  const stage = fields.get("stage");
  const order = {
    id: `PED-2024-${String(nextNumber).padStart(3, "0")}`,
    client: fields.get("client").trim(),
    initials: fields.get("client").trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase(),
    product: fields.get("product").trim(),
    quantity: Number(fields.get("quantity")),
    dueDate: fields.get("dueDate"),
    status: stage === "Pronto" ? "Pronto para entrega" : "Em produção",
    stage,
    priority: fields.get("priority")
  };
  orders.unshift(order);
  renderDashboard();
  renderConsultation();
  form.reset();
  showView("consulta");
  showToast(`${order.id} cadastrado nesta sessão. Os dados não foram enviados a uma API.`);
});

document.querySelector("#today-date").textContent = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short", day: "2-digit", month: "short", year: "numeric"
}).format(new Date()).replace(".", "");
document.querySelector("#dashboard-date").textContent = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long", day: "2-digit", month: "long", year: "numeric"
}).format(new Date()).toLocaleUpperCase("pt-BR");
renderDashboard();
renderConsultation();
renderTimeline();
