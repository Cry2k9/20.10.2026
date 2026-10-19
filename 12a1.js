
const nameList = document.getElementById("nameList");
const loadError = document.getElementById("loadError");

const passwordPanel = document.getElementById("passwordPanel");
const passwordForm = document.getElementById("passwordForm");
const birthdayInput = document.getElementById("birthdayInput");
const passwordError = document.getElementById("passwordError");
const selectedName = document.getElementById("selectedName");

const wishPanel = document.getElementById("wishPanel");
const wishName = document.getElementById("wishName");
const wishContent = document.getElementById("wishContent");

const closePassword = document.getElementById("closePassword");
const closeWish = document.getElementById("closeWish");
const backToNames = document.getElementById("backToNames");

let students = [];
let currentStudent = null;

function normalizeBirthday(date) {
    return date.trim().replace(/\D/g, "");
}

function renderStudents() {
    nameList.replaceChildren();

    if (students.length === 0) {
        nameList.textContent = "Chưa có dữ liệu học sinh.";
        return;
    }

    const specialStudent = students.find(
        student => student.name === "Dịch Thị Hồng Ánh"
    );

    const otherStudents = students.filter(
        student => student.name !== "Dịch Thị Hồng Ánh"
    );

    function createStudentButton(student, isSpecial = false) {
        const button = document.createElement("button");

        button.type = "button";
        button.className = isSpecial
            ? "name-button special-member"
            : "name-button";

        const icon = document.createElement("span");
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = isSpecial ? "👑" : "🌷";

        button.appendChild(icon);
        button.appendChild(
            document.createTextNode(" " + student.name)
        );

        button.addEventListener("click", () => {
            openPasswordPanel(student);
        });

        return button;
    }

    if (specialStudent) {
        nameList.appendChild(
            createStudentButton(specialStudent, true)
        );
    }

    otherStudents.forEach(student => {
        nameList.appendChild(
            createStudentButton(student)
        );
    });
}

function hidePanels() {
    passwordPanel.hidden = true;
    wishPanel.hidden = true;

    passwordError.hidden = true;
    birthdayInput.value = "";
    currentStudent = null;
}

function openPasswordPanel(student) {
    currentStudent = student;

    wishPanel.hidden = true;
    passwordPanel.hidden = false;

    selectedName.textContent = student.name;
    passwordError.hidden = true;
    birthdayInput.value = "";

    passwordPanel.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    birthdayInput.focus({ preventScroll: true });
}

passwordForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!currentStudent) {
        return;
    }

    const enteredPassword = birthdayInput.value.trim();
    const correctPassword = normalizeBirthday(
        currentStudent.date
    );

    if (
        !/^\d{8}$/.test(enteredPassword) ||
        enteredPassword !== correctPassword
    ) {
        passwordError.hidden = false;
        birthdayInput.select();
        return;
    }

    passwordError.hidden = true;
    passwordPanel.hidden = true;
    wishPanel.hidden = false;

    wishName.textContent = currentStudent.name;

    wishContent.textContent = currentStudent.wish || "";

    wishPanel.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});

closePassword.addEventListener("click", () => {
    hidePanels();
});

closeWish.addEventListener("click", () => {
    hidePanels();
});

backToNames.addEventListener("click", () => {
    hidePanels();

    document.querySelector(".name-section").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

async function loadStudents() {
    try {
        const response = await fetch("12a1.json", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Không thể đọc file 12a1.json.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error(
                "Dữ liệu 12a1.json phải là một danh sách JSON."
            );
        }

        students = data.filter((student) => {
            return (
                typeof student.name === "string" &&
                typeof student.date === "string" &&
                /^\d{2}\/\d{2}\/\d{4}$/.test(student.date)
            );
        });

        if (students.length === 0) {
            throw new Error(
                "Không tìm thấy học sinh hợp lệ trong ds.json."
            );
        }

        renderStudents();
    } catch (error) {
        console.error("Lỗi tải danh sách:", error);

        nameList.replaceChildren();
        loadError.hidden = false;

        loadError.textContent =
            "Không tải được danh sách lớp. " +
            "Hãy kiểm tra file ds.json và chạy website bằng Live Server.";
    }
}

loadStudents();
