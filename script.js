let registros = [];
let aplicador = "";

function iniciar() {
  aplicador = document.getElementById("aplicadorNome").value.trim();
  if (!aplicador) {
    alert("Digite o nome do aplicador");
    return;
  }

  document.getElementById("aplicadorBox").classList.add("hidden");
  document.getElementById("sistema").classList.remove("hidden");
  document.getElementById("aplicadorTitulo").innerText =
    `Aplicador: ${aplicador}`;

  carregarCache();
}

function registrar() {
  const numero = document.getElementById("numeroAtleta").value;
  if (!numero) return;

  const horario = new Date().toLocaleTimeString("pt-BR");

  registros.push({ numero, horario });
  salvarCache();
  atualizarTela();

  document.getElementById("ultimoRegistro").innerText =
    `Atleta ${numero} - ${horario}`;

  document.getElementById("numeroAtleta").value = "";
}

function atualizarTela() {
  const tbody = document.getElementById("tabela");
  tbody.innerHTML = "";

  registros.forEach((r, i) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <input value="${r.numero}" onchange="editar(${i}, this.value)">
      </td>
      <td>${r.horario}</td>
      <td>
        <button class="botao-excluir" onclick="remover(${i})">X</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function editar(index, novoNumero) {
  registros[index].numero = novoNumero;
  salvarCache();
}

function remover(index) {
  const confirmar = confirm(
    `Tem certeza que deseja excluir o atleta ${registros[index].numero}?`
  );

  if (!confirmar) return;

  registros.splice(index, 1);
  salvarCache();
  atualizarTela();
}

function salvarCache() {
  localStorage.setItem(
    "enduro_dados",
    JSON.stringify({ aplicador, registros })
  );
}

function carregarCache() {
  const cache = localStorage.getItem("enduro_dados");
  if (!cache) return;

  const dados = JSON.parse(cache);
  registros = dados.registros || [];
  atualizarTela();
}

function exportarCSV() {
  let csv = `Aplicador;${aplicador}\nAtleta;Horário\n`;
  registros.forEach(r => {
    csv += `${r.numero};${r.horario}\n`;
  });
  baixar(csv, "registros.csv");
}

function exportarTXT() {
  let txt = `Aplicador: ${aplicador}\n\n`;
  registros.forEach(r => {
    txt += `Atleta ${r.numero} - ${r.horario}\n`;
  });
  baixar(txt, "registros.txt");
}

function exportarJSON() {
  const json = JSON.stringify({ aplicador, registros }, null, 2);
  baixar(json, "registros.json");
}

function baixar(conteudo, nome) {
  const blob = new Blob([conteudo], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = nome;
  link.click();
}

function removerTodos() {
  if (registros.length === 0) {
    alert("Não há registros para excluir.");
    return;
  }

  const confirmar = confirm(
    "Tem certeza que deseja excluir TODOS os registros?\nEssa ação não pode ser desfeita."
  );

  if (!confirmar) return;

  registros = [];
  salvarCache();
  atualizarTela();
  document.getElementById("ultimoRegistro").innerText = "Nenhum";
}
