function parseFraction(value) {
    value = value.replace(/\s/g, "");

    if (value.includes("/")) {
        let [num, den] = value.split("/").map(Number);
        return num / den;
    }
    return Number(value);
}

function parseDivisor(input) {
    input = input.replace(/\s/g, "");

    if (input === "x") return { a: 1, b: 0 };
    if (input === "-x") return { a: -1, b: 0 };

    let match = input.match(/^([\-]?\d*)x([+\-]\d+)?$/);

    if (match) {
        let a = match[1];
        let b = match[2];

        if (a === "" || a === "+") a = 1;
        if (a === "-") a = -1;

        a = Number(a);
        b = b ? Number(b) : 0;

        return { a, b };
    }

    return { a: 1, b: -parseFraction(input) };
}

// 🔥 소수 제거 (2.000 → 2)
function cleanNumber(num) {
    if (Math.abs(num - Math.round(num)) < 1e-10) {
        return Math.round(num);
    }
    return Number(num.toFixed(3));
}

function syntheticDivision(coeffs, a, b) {
    let r = -b / a;
    let result = [coeffs[0]];
    let middle = [];

    for (let i = 1; i < coeffs.length; i++) {
        let mul = result[i - 1] * r;
        middle.push(mul);

        let next = coeffs[i] + mul;
        result.push(next);
    }

    let quotient = result.slice(0, -1).map(v => v / a);
    let remainder = result[result.length - 1];

    return { result, quotient, remainder, r, middle };
}

function renderTable(coeffs, result, middle, r) {
    let html = `<table class="synthetic">`;

    html += `<tr>
        <td class="r">${cleanNumber(r)}</td>
        <td class="line"></td>
        ${coeffs.map(v => `<td>${cleanNumber(v)}</td>`).join("")}
    </tr>`;

    html += `<tr>
        <td></td>
        <td class="line"></td>
        <td></td>
        ${middle.map(v => `<td>${cleanNumber(v)}</td>`).join("")}
    </tr>`;

    html += `<tr class="bottom">
        <td></td>
        <td class="line"></td>
        ${result.map(v => `<td>${cleanNumber(v)}</td>`).join("")}
    </tr>`;

    html += `</table>`;
    return html;
}

function calculate() {
    let coeffs = document.getElementById("coeffs").value
        .split(",")
        .map(v => parseFraction(v));

    let divisorInput = document.getElementById("divisor").value;

    let { a, b } = parseDivisor(divisorInput);

    let { result, quotient, remainder, r, middle } =
        syntheticDivision(coeffs, a, b);

    let table = renderTable(coeffs, result, middle, r);

    // 👉 계수만 표시
    let quotientText = quotient.map(v => cleanNumber(v)).join(", ");

    document.getElementById("result").innerHTML = `
        ${table}
        <p>몫의 계수: ${quotientText}</p>
        <p>나머지: ${cleanNumber(remainder)}</p>
    `;
}