# Stella Admin

Repositório do sistema Stella - Painel de gerenciamento da aplicação.

---

### Informações gerais quanto ao projeto

O projeto utiliza o FUSE React framework (<https://react-material.fusetheme.com/sign-in>)

O framework de UI é o Mui Material (<https://mui.com/material-ui/getting-started/overview/>)

E para estilizações é utilizado o TailwindCSS (<https://tailwindcss.com/docs/installation>)

Para instalar as dependências rode o seguinte comando:

```sh
npm install
```

Para rodar o projeto:

```sh
npm run dev
```

---

### Padronização de nomenclaturas do projeto

#### Nome de pastas: Padrão kebab-case

- Exemplo: help-center

#### Nome de arquivos

##### Padrão PascalCase para arquivos .tsx

- Exemplo: UserConfig.tsx

##### Padrão camelCase para arquivos de slices

- Exemplo: userSlice.ts

#### Padrão de nomenclatura de variáveis e componentes

##### Nome de componentes: Padrão PascalCase

- Exemplo: User

##### Nome de variáveis e funções: Padrão camelCase

- Exemplo: dataProfile

##### Nome de Tipagem: Padrão camelCase com prefixo de tipo

- Exemplo: I[User] para interface
- Exemplo: T[User] para type
- Exemplo: Props[List] para props

---

#### Uso de Dispatch e Selectors

Para buscas e ações de estados globais utilizar o AppDispatch e AppSelector. E estados pertencentes ao modulo utilizar o dispatch e selector do módulo.

Exemplo:

> Global

```ts
export function ListProduct(){
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products);
}
```

> Módulo

```ts
export function ListProduct(){
  const dispatchSControl = useDispatchSControl();
  const products = useSelectorSControl((state) => state.products);
}
```

---

#### Padrão de Handlers

Para handlers utilizar `function`.

Exemplo:

```ts
function handleSave(event: React.FormEvent<HTMLFormElement>){
  // Código
}

function handleAction(_: unknown, value: string){
  // Código
}
```

---

### Definição de estados Redux

```ts
type InitialState = {
  loading: boolean;
  payload: Type;
}
```

### Arquitetura para novas features

A organização de diretórios deve ser seguida conforme padrão do framework.

Exemplo:

```tree
├── components (components compartilhados entre módulos)
└── modules
    └── s-module
        ├── components (componentes compartilhados entre páginas)
        ├── pages
        │   ├── [page]
        │   │ ├── components
        │   │ │   └── [component].tsx
        │   │ ├── screens
        │   │ │   ├── [screen]
        │   │ │   │   ├── components
        │   │ │   │   └── [screen].tsx
        │   │ │   └── [screen].tsx
        │   │ ├── store
        │   │ │   └── [slice].ts
        │   │ └── types
        │   │     └── [type].ts
        │   └── [Page]RoutesConfig.tsx
        ├── store
        │   └── [slice].ts
        ├── utils
        │   └── formatters
        │     └── formatter.ts
        ├── index.tsx
        └── [module]RoutesConfig.tsx
```
