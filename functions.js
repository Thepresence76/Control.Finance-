const Modal = {
  Open() {
    document.querySelector(".modal-container").classList.add("active");
  },
  Close() {
    document.querySelector(".modal-container").classList.remove("active");
  },
};

const  titulo = document.querySelector('header h3')
const  Animated= (elemento)=> {
const textoArrey = elemento.innerHTML.split('')
textoArrey.forEach((letra, index) =>{
 elemento.innerHTML = "";
 setTimeout(()=>{
    elemento.innerHTML += letra 
 },200 * index)
})
       }

setInterval(()=>{
  Animated(titulo)
},5000)


const Storage = {

    get(){
        return JSON.parse(localStorage.getItem('C.finances:transactions'))|| []
    },
    set(transactions) {
        localStorage.setItem("C.finances:transactions", JSON.stringify(transactions));
    }
}

const Transaction = {
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction);

    App.reload();
  },

  remove(index) {
    Transaction.all.splice(index, 1);

    App.reload();
  },

  Incomes() {
    //somar das entradas
    let income = 0;

    Transaction.all.forEach((deposit) => {
      if (deposit.amount > 0) {
        income += deposit.amount;
      }
    });
    return income;
  },
  Expenses() {
    //somar das saidas
    let cashOut = 0;

    Transaction.all.forEach((WithdrawMoney) => {
      if (WithdrawMoney.amount < 0) {
        cashOut += WithdrawMoney.amount;
      }
    });
    return cashOut;
  },
  Saldo() {
    // entradas - saidas
    const money = Transaction.Incomes() + Transaction.Expenses() 
    
    if(money > 0) {
        Status.style = `
        color:white;
        background-color:#AB0FEC
        `
        
    }else if(money < 0) {
        Status.style = `
        color:white;
        background-color:#F80606;
        `
        alert('Cuidado!, seu saldo esta negativo')
    }

    return  money
  },

  
 
}

const DOM = {
  transactionContainer: document.querySelector("#date-table tbody"),

  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    DOM.transactionContainer.appendChild(tr);
  },
  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? "expense" : "income";

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
        
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
            <img
                onclick="Transaction.remove(${index})" src="imagens/minus-circle-solid.svg"
                alt="Remover Transação"
            />
            </td>
        
        `;

    return html;
  },

  updateBalance() {
    // mostra os valores dos cards
    document.getElementById("saldo-display").innerHTML = Utils.formatCurrency(
      Transaction.Saldo()
    );

    document.getElementById("saidas-display").innerHTML = Utils.formatCurrency(
      Transaction.Expenses()
    );

    document.getElementById(
      "entradas-display"
    ).innerHTML = Utils.formatCurrency(Transaction.Incomes());

  },

  clearTransections() {
    DOM.transactionContainer.innerHTML = "";
  },
};


const Utils = {
  formatDate(date) {
    const splitedDate = date.split("-");

    return `${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`;
  },

  formatAmount(value) {
    value = Number(value) * 100;

    return value;
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";

    value = String(value).replace(/\D/g, "");

    value = Number(value) / 100;

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return signal + value;
  },
};

const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),

  getValue() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },

  formatValues() {
    let { description, amount, date } = Form.getValue();

    amount = Utils.formatAmount(amount);

    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date,
    };
  },
  validateField() {
    const { description, amount, date } = Form.getValue();

    if (description.trim() == "" || amount.trim() == "" || date.trim() == "") {
      throw new Error("Por favor, preencha todos os campos");
    }
  },

  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },

  submit(event) {
    event.preventDefault();

    try {
      Form.validateField();
      const transection = Form.formatValues();
      Transaction.add(transection);
      Form.clearFields();
      Modal.Close();
    } catch (error) {
      alert(error.message);
    }
  },
};


const App = {
  init() {
    Transaction.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index);
    });

    DOM.updateBalance()
    Storage.set(Transaction.all)
  },
  reload() {
    DOM.clearTransections()
    App.init()
    
  },
};

App.init();

