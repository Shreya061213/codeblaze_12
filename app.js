const API = "http://localhost:5000/api";

/* ------------------------------
   LOGIN
--------------------------------*/
async function login() {
    try {
        const phone = document.getElementById("phone").value;
        const password = document.getElementById("password").value;

        const res = await fetch(`${API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, password })
        });

        const data = await res.json();

        if (!data.role) {
            alert(data.msg || "Invalid login");
            return;
        }

        // Save SESSION
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name);
        localStorage.setItem("role", data.role);
        // optional: store user id if backend returns it: localStorage.setItem("userId", data.id);

        if (data.role === "owner") {
            window.location.href = "owner.html";
        } else {
            window.location.href = "customer.html";
        }
    } catch (err) {
        console.error("Login error:", err);
        alert("Login failed. Check console for details.");
    }
}

/* ------------------------------
   LOGOUT
--------------------------------*/
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

/* ------------------------------
   TAB SWITCH (Owner)
--------------------------------*/
function showTab(tabId) {
    document.querySelectorAll(".tabContent").forEach(div => {
        div.classList.add("hidden");
    });
    const el = document.getElementById(tabId);
    if (el) el.classList.remove("hidden");
}

/* ------------------------------
   TAB SWITCH (Customer)
--------------------------------*/
function showCustomerTab(tabId) {
    document.querySelectorAll(".tabContent").forEach(div => {
        div.classList.add("hidden");
    });
    const el = document.getElementById(tabId);
    if (el) el.classList.remove("hidden");
}

/* ------------------------------
   Helpers
--------------------------------*/
function authHeaders() {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
}

/* ------------------------------
   FETCH UDH AAR (Owner)
   Replace ownerId with a real owner id (or store user id after login)
--------------------------------*/
async function fetchUdhaar() {
    try {
        const ownerId = "123"; // <-- replace with actual owner id (or load from localStorage/user profile)

        const res = await fetch(`${API}/udhaar/${ownerId}`, {
            headers: authHeaders()
        });
        const data = await res.json();

        document.getElementById("udhaarList").innerHTML =
            `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (err) {
        console.error("fetchUdhaar error:", err);
        alert("Failed to fetch udhaar. See console.");
    }
}

/* ------------------------------
   FETCH INVENTORY (Owner)
--------------------------------*/
async function fetchInventory() {
    try {
        const ownerId = "123"; // <-- replace with actual owner id

        const res = await fetch(`${API}/inventory/${ownerId}`, {
            headers: authHeaders()
        });
        const data = await res.json();

        document.getElementById("inventoryList").innerHTML =
            `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (err) {
        console.error("fetchInventory error:", err);
        alert("Failed to fetch inventory. See console.");
    }
}

/* ------------------------------
   ADD INVENTORY (Owner)
--------------------------------*/
async function addInventory() {
    try {
        const ownerId = "123"; // <-- replace with actual owner id

        const itemName = document.getElementById("itemName").value;
        const stock = Number(document.getElementById("itemStock").value);
        const price = Number(document.getElementById("itemPrice").value);

        const res = await fetch(`${API}/inventory/add`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({
                ownerId,
                itemName,
                stock,
                price
            })
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(err);
        }

        await res.json();
        alert("Item Added!");
        fetchInventory();
    } catch (err) {
        console.error("addInventory error:", err);
        alert("Failed to add inventory. See console.");
    }
}

/* ------------------------------
   BILLING (Owner)
--------------------------------*/
async function generateBill() {
    try {
        const ownerId = "123"; // <-- replace with actual owner id

        const item = document.getElementById("billItem").value;
        const price = Number(document.getElementById("billPrice").value);

        const res = await fetch(`${API}/billing/sale`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({
                ownerId,
                item,
                price
            })
        });

        const data = await res.json();

        document.getElementById("receiptBox").innerHTML =
            `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (err) {
        console.error("generateBill error:", err);
        alert("Failed to generate bill. See console.");
    }
}

/* ------------------------------
   CUSTOMER: FETCH UDH AAR 
--------------------------------*/
async function fetchCustomerUdhaar() {
    try {
        const customerId = "999"; // <-- replace with actual customer id

        const res = await fetch(`${API}/udhaar/${customerId}`, {
            headers: authHeaders()
        });
        const data = await res.json();

        document.getElementById("balanceBox").innerHTML =
            `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (err) {
        console.error("fetchCustomerUdhaar error:", err);
        alert("Failed to fetch customer udhaar. See console.");
    }
}

/* ------------------------------
   CUSTOMER: FETCH LOYALTY 
--------------------------------*/
async function fetchLoyalty() {
    try {
        const customerId = "999"; // <-- replace with actual customer id

        const res = await fetch(`${API}/loyalty/${customerId}`, {
            headers: authHeaders()
        });
        const data = await res.json();

        document.getElementById("loyaltyBox").innerHTML =
            `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (err) {
        console.error("fetchLoyalty error:", err);
        alert("Failed to fetch loyalty. See console.");
    }
}

/* ------------------------------
   CUSTOMER: FETCH RECEIPTS 
--------------------------------*/
async function fetchReceipts() {
    try {
        const customerId = "999"; // <-- replace with actual customer id

        const res = await fetch(`${API}/billing/history/${customerId}`, {
            headers: authHeaders()
        });
        const data = await res.json();

        document.getElementById("receiptList").innerHTML =
            `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (err) {
        console.error("fetchReceipts error:", err);
        alert("Failed to fetch receipts. See console.");
    }
}
