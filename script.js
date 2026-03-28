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

// 🔥 교과서 스타일 표
function renderTable(coeffs, result, middle, r) {
    let html = `<table class="synthetic">`;

    // 첫 줄 (계수)
    html += `<tr>
        <td class="r">${r.toFixed(3)}</td>
        <td class="line"></td>
        ${coeffs.map(v => `<td>${v}</td>`).join("")}
    </tr>`;

    // 둘째 줄 (곱한 값)
    html += `<tr>
        <td></td>
        <td class="line"></td>
        <td></td>
        ${middle.map(v => `<td>${v.toFixed(3)}</td>`).join("")}
    </tr>`;

    // 셋째 줄 (결과)
    html += `<tr class="bottom">
        <td></td>
        <td class="line"></td>
        ${result.map(v => `<td>${v.toFixed(3)}</td>`).join("")}
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

    let poly = quotient.map((c, i) => {
        let deg = quotient.length - i - 1;
        if (deg === 0) return c.toFixed(3);
        if (deg === 1) return `${c.toFixed(3)}x`;
        return `${c.toFixed(3)}x^${deg}`;
    }).join(" + ");

    document.getElementById("result").innerHTML = `
        ${table}
        <p>몫: ${poly}</p>
        <p>나머지: ${remainder.toFixed(3)}</p>
    `;
}