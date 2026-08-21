<div align="center">

<p align="center">
<img src="graphVisualizer/public/banner.gif" alt="Banner" width="100%" style="border-radius: 10px; box-shadow: 0 0 30px rgba(0, 229, 255, 0.3); border: 1px solid rgba(0, 229, 255, 0.1);" />
</p>

<h1 align="center">
<img src="https://readme-typing-svg.herokuapp.com?font=Chakra+Petch&weight=900&size=50&duration=3000&pause=1000&color=00E5FF&center=true&vCenter=true&width=1000&lines=GRAPH+VISUALIZER" alt="Typing SVG" />
</h1>

<p align="center">
<strong>Um laboratório interativo para criação, visualização e exploração de algoritmos em grafos.</strong>
</p>

<p align="center">
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
</p>

</div>

---

## 🎬 Vídeo do Projeto

Em breve...

---

## 🧠 Sobre o Projeto

**GraphLab** é uma aplicação web interativa desenvolvida para facilitar o estudo e a compreensão de **Teoria dos Grafos e Algoritmos de Busca**.

A proposta é transformar conceitos normalmente apresentados apenas através de código, fórmulas e diagramas estáticos em uma experiência **visual, interativa e executável diretamente no navegador**.

O usuário pode construir seu próprio grafo, definir suas propriedades e executar algoritmos sobre ele, acompanhando visualmente cada etapa da execução.

---

## ✨ Destaques da V1

| Feature                      | Descrição                                                            | Tecnologia           |
| ---------------------------- | -------------------------------------------------------------------- | -------------------- |
| **Editor de Grafos**         | Criação, movimentação e remoção de vértices diretamente na interface | `React + TypeScript` |
| **Arestas Direcionadas**     | Suporte a arestas com orientação através de setas                    | `Graph Engine`       |
| **DFS**                      | Busca em profundidade com rastreamento completo da execução          | `TypeScript`         |
| **BFS**                      | Busca em largura utilizando estrutura de fila                        | `TypeScript`         |
| **Temporização**             | Registro dos tempos de descoberta e finalização dos vértices         | `DFS Timer`          |
| **Classificação de Arestas** | Identificação automática de árvore, retorno, avanço e cruzamento     | `Graph Engine`       |
| **Execução Visual**          | Animação da exploração do grafo passo a passo                        | `React State`        |
| **Painel de Informações**    | Exibição dos estados, tempos e resultados dos algoritmos             | `React + Tailwind`   |

---

## 🕸️ Editor de Grafos

O usuário possui liberdade para construir o grafo diretamente na aplicação.

### Operações disponíveis

* Adicionar vértices
* Remover vértices
* Criar arestas
* Remover arestas
* Mover vértices
* Definir grafo direcionado
* Definir grafo não direcionado
* Selecionar vértice inicial
* Executar algoritmos sobre o grafo

A visualização é atualizada em tempo real conforme o grafo é modificado.

---

## 🔍 Algoritmos

### DFS — Depth-First Search

A **Busca em Profundidade** explora um caminho o máximo possível antes de retornar e explorar outras possibilidades.

Durante sua execução, o GraphLab registra:

```text
Tempo de descoberta
Tempo de finalização
Pai de cada vértice
Ordem de visita
Classificação das arestas
```

Exemplo:

```text
        A
       / \
      B   C
     / \
    D   E
```

Execução:

```text
A → B → D → E → C
```

---

## 🎬 Execução Passo a Passo

Um dos principais objetivos do projeto é permitir que o usuário **veja o algoritmo acontecendo**.

Em vez de simplesmente apresentar o resultado final:

```text
DFS(A)
```

o GraphLab permite acompanhar cada etapa:

```text
[01] Visitando A
     d[A] = 1

[02] Explorando A → B
     Aresta de Árvore

[03] Visitando B
     d[B] = 2

[04] Explorando B → A
     Aresta de Retorno

[05] Finalizando B
     f[B] = 5
```

O grafo é atualizado visualmente a cada etapa da execução.

---

## 📚 Conceitos Abordados (A sofrer alterações)

A V1 utiliza conceitos fundamentais de **Teoria dos Grafos e Estruturas de Dados**:

* Grafos direcionados
* Grafos não direcionados
* Vértices
* Arestas
* Lista de adjacência
* Busca em profundidade (DFS)
* Busca em largura (BFS)
* Árvore de busca
* Tempo de descoberta
* Tempo de finalização
* Relação de ancestralidade
* Classificação de arestas
* Fila
* Pilha / recursão

---

## 🚀 Roadmap

### V1 — Fundamentos

* [x] Estrutura base do projeto
* [x] Editor de grafos
* [x] Vértices interativos
* [x] Arestas direcionadas
* [x] Arestas não direcionadas
* [ ] DFS
* [ ] BFS
* [ ] Animação dos algoritmos
* [ ] Tempos de descoberta
* [ ] Tempos de finalização
* [ ] Classificação das arestas
* [x] Painel de informações
* [ ] Aba de definições

### V2 — Fundamentos Avançados (A sofrer alterações)

* [ ] Detecção de ciclos
* [ ] Componentes conexos
* [ ] ...

### V3 — Laboratório (A sofrer alterações)

* [ ] Modo passo a passo avançado
* [ ] Exemplos pré-configurados
* [ ] ...

---

## 🛠️ Tecnologias

* **React**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Canvas / SVG**
* **Estruturas de Dados implementadas em TypeScript**

---

## 🌐 Acesse o Projeto

**Link para a aplicação:**

```text
Em breve...
```

---

<div align="center">

### 🕸️ GRAPH. VISUALIZE. UNDERSTAND.

<strong>Transformando algoritmos abstratos em experiências visuais.</strong>

</div>
