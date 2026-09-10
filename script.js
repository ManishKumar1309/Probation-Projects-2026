/* Purane transactions lena */
let transactions = JSON.parse(localStorage.getItem("transactions"));

if (transactions == null) {
    transactions = [];
}

/* Data save karna */
function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

/* Rupees me amount dikhana */
function money(amount) {
    return "₹" + Number(amount).toLocaleString("en-IN");
}

/* Date ko simple format me dikhana */
function showDate(date) {
    let d = new Date(date);

    return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

/* Total income, expense aur balance */
function updateTotal() {
    let totalIncome = 0;
    let totalExpense = 0;

    for (let i = 0; i < transactions.length; i++) {

        if (transactions[i].type === "income") {
            totalIncome += Number(transactions[i].amount);
        } else {
            totalExpense += Number(transactions[i].amount);
        }
    }

    let totalBalance = totalIncome - totalExpense;

    document.getElementById("income").textContent = money(totalIncome);
    document.getElementById("expense").textContent = money(totalExpense);
    document.getElementById("balance").textContent = money(totalBalance);
}


/* New transaction add karna */
document.getElementById("form").addEventListener("submit", function(event) {

    event.preventDefault();

    let title = document.getElementById("title").value.trim();
    let amount = document.getElementById("amount").value;
    let type = document.getElementById("type").value;
    let category = document.getElementById("category").value;
    let date = document.getElementById("date").value;

    if (title === "" || amount === "" || Number(amount) <= 0 || date === "") {
        alert("Please enter valid details.");
        return;
    }

    let data = {
        id: Date.now().toString(),
        title: title,
        amount: Number(amount),
        type: type,
        category: category,
        date: date
    };

    transactions.push(data);

    saveData();

    document.getElementById("form").reset();

    showList();
    updateTotal();
});


/* Transactions show karna */
function showList() {

    let list = document.getElementById("list");
    let empty = document.getElementById("empty");

    list.innerHTML = "";

    let searchText = document.getElementById("search").value.toLowerCase().trim();
    let typeFilter = document.getElementById("typefilter").value;
    let categoryFilter = document.getElementById("catfilter").value;
    let sortValue = document.getElementById("sort").value;

    let result = [];


    /* Search aur filter */
    for (let i = 0; i < transactions.length; i++) {

        let item = transactions[i];

        let titleMatch = item.title.toLowerCase().includes(searchText);
        let typeMatch = typeFilter === "all" || item.type === typeFilter;
        let categoryMatch = categoryFilter === "all" || item.category === categoryFilter;

        if (titleMatch && typeMatch && categoryMatch) {
            result.push(item);
        }
    }


    /* Sort */
    if (sortValue === "dateDesc") {

        result.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });

    } else if (sortValue === "dateAsc") {

        result.sort(function(a, b) {
            return new Date(a.date) - new Date(b.date);
        });

    } else if (sortValue === "amountDesc") {

        result.sort(function(a, b) {
            return b.amount - a.amount;
        });

    } else if (sortValue === "amountAsc") {

        result.sort(function(a, b) {
            return a.amount - b.amount;
        });
    }


    /* Agar koi transaction nahi hai */
    if (result.length === 0) {

        empty.style.display = "block";
        return;
    }

    empty.style.display = "none";


    /* List me items banana */
    for (let i = 0; i < result.length; i++) {

        let item = result[i];

        let box = document.createElement("div");
        box.className = "item";

        let info = document.createElement("div");
        info.className = "info";

        let title = document.createElement("span");
        title.className = "itemtitle";
        title.textContent = item.title;

        let details = document.createElement("span");
        details.className = "details";
        details.textContent = item.category + " • " + showDate(item.date);

        info.appendChild(title);
        info.appendChild(details);


        let right = document.createElement("div");
        right.className = "right";

        let amount = document.createElement("span");
        amount.className = "money";


        if (item.type === "income") {

            amount.textContent = "+ " + money(item.amount);
            amount.style.color = "green";

        } else {

            amount.textContent = "- " + money(item.amount);
            amount.style.color = "red";
        }


        let buttons = document.createElement("div");
        buttons.className = "buttons";


        let editButton = document.createElement("button");
        editButton.className = "btn edit";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function() {
            editData(item.id);
        });


        let deleteButton = document.createElement("button");
        deleteButton.className = "btn del";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            deleteData(item.id);
        });


        buttons.appendChild(editButton);
        buttons.appendChild(deleteButton);

        right.appendChild(amount);
        right.appendChild(buttons);

        box.appendChild(info);
        box.appendChild(right);

        list.appendChild(box);
    }
}


/* Delete */
function deleteData(id) {

    let newData = [];

    for (let i = 0; i < transactions.length; i++) {

        if (transactions[i].id !== id) {
            newData.push(transactions[i]);
        }
    }

    transactions = newData;

    saveData();

    showList();
    updateTotal();
}


/* Edit box open karna */
function editData(id) {

    let item = null;

    for (let i = 0; i < transactions.length; i++) {

        if (transactions[i].id === id) {
            item = transactions[i];
            break;
        }
    }

    if (item === null) {
        return;
    }

    document.getElementById("editid").value = item.id;
    document.getElementById("edittitle").value = item.title;
    document.getElementById("editamount").value = item.amount;
    document.getElementById("edittype").value = item.type;
    document.getElementById("editcat").value = item.category;
    document.getElementById("editdate").value = item.date;

    document.getElementById("modal").classList.remove("hide");
}


/* Edit box close */
function closeEdit() {
    document.getElementById("modal").classList.add("hide");
}

document.getElementById("cancel").addEventListener("click", closeEdit);


/* Edited data save karna */
document.getElementById("editform").addEventListener("submit", function(event) {

    event.preventDefault();

    let id = document.getElementById("editid").value;
    let title = document.getElementById("edittitle").value.trim();
    let amount = document.getElementById("editamount").value;
    let type = document.getElementById("edittype").value;
    let category = document.getElementById("editcat").value;
    let date = document.getElementById("editdate").value;


    if (title === "" || amount === "" || Number(amount) <= 0 || date === "") {

        alert("Please enter valid details.");
        return;
    }


    for (let i = 0; i < transactions.length; i++) {

        if (transactions[i].id === id) {

            transactions[i].title = title;
            transactions[i].amount = Number(amount);
            transactions[i].type = type;
            transactions[i].category = category;
            transactions[i].date = date;

            break;
        }
    }

    saveData();

    showList();
    updateTotal();
    closeEdit();
});


/* Search */
document.getElementById("search").addEventListener("input", showList);


/* Type filter */
document.getElementById("typefilter").addEventListener("change", showList);


/* Category filter */
document.getElementById("catfilter").addEventListener("change", showList);


/* Sort */
document.getElementById("sort").addEventListener("change", showList);


/* Page load */
showList();
updateTotal();