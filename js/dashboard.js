let currentUserEmail = "";

/* ==========================
AUTH CHECK
========================== */

auth.onAuthStateChanged(async (user) => {

```
if (!user) {
    window.location.href = "index.html";
    return;
}

currentUserEmail = user.email;

document.getElementById("email").value = user.email;

await loadProfile(user.email);
```

});

/* ==========================
LOGOUT
========================== */

function logout() {

```
auth.signOut()
    .then(() => {
        window.location.href = "index.html";
    })
    .catch((error) => {
        console.error(error);
    });
```

}

/* ==========================
LOAD PROFILE
========================== */

async function loadProfile(email) {

```
try {

    const doc = await db
        .collection("users")
        .doc(email)
        .get();

    if (!doc.exists) return;

    const data = doc.data();

    Object.keys(data).forEach((key) => {

        const el = document.getElementById(key);

        if (el) {
            el.value = data[key];
        }

    });

    if (data.slug) {

        const portfolioURL =
            `${window.location.origin}${window.location.pathname.replace("dashboard.html", "")}portfolio.html?slug=${data.slug}`;

        document.getElementById("portfolioLink").innerHTML = `
            <div class="bg-zinc-900 p-4 rounded-lg">
                <p class="text-green-400 mb-2">
                    Portfolio Already Generated
                </p>

                <a
                    href="${portfolioURL}"
                    target="_blank"
                    class="text-blue-400 underline break-all">

                    ${portfolioURL}

                </a>
            </div>
        `;
    }

}
catch (error) {

    console.error(error);
    alert(error.message);

}
```

}

/* ==========================
SAVE PROFILE
========================== */

async function saveProfile() {

```
try {

    const profile = {

        name: document.getElementById("name").value,

        phone: document.getElementById("phone").value,

        email: document.getElementById("email").value,

        bio: document.getElementById("bio").value,

        school: document.getElementById("school").value,

        passingYear: document.getElementById("passingYear").value,

        college: document.getElementById("college").value,

        degree: document.getElementById("degree").value,

        branch: document.getElementById("branch").value,

        collegeStart: document.getElementById("collegeStart").value,

        collegeEnd: document.getElementById("collegeEnd").value,

        linkedin: document.getElementById("linkedin").value,

        github: document.getElementById("github").value,

        skills: document.getElementById("skills").value,

        project1Name: document.getElementById("project1Name").value,
        project1Details: document.getElementById("project1Details").value,

        project2Name: document.getElementById("project2Name").value,
        project2Details: document.getElementById("project2Details").value,

        project3Name: document.getElementById("project3Name").value,
        project3Details: document.getElementById("project3Details").value,

        updatedAt: new Date().toISOString()

    };

    await db
        .collection("users")
        .doc(currentUserEmail)
        .set(profile, { merge: true });

    alert("Profile Saved Successfully");

}
catch (error) {

    console.error(error);
    alert(error.message);

}
```

}

/* ==========================
GENERATE PORTFOLIO
========================== */

async function generatePortfolio() {

```
try {

    const fullName =
        document.getElementById("name").value;

    if (!fullName) {

        alert("Please enter your name first.");
        return;

    }

    const slug = fullName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, "-");

    await db
        .collection("users")
        .doc(currentUserEmail)
        .set({

            slug: slug,
            portfolioGenerated: true,
            portfolioCreatedAt:
                new Date().toISOString()

        }, { merge: true });

    const portfolioURL =
        `${window.location.origin}${window.location.pathname.replace("dashboard.html", "")}portfolio.html?slug=${slug}`;

    document.getElementById("portfolioLink").innerHTML = `
        <div class="bg-zinc-900 p-4 rounded-lg">
            <p class="text-green-400 mb-2">
                Portfolio Generated Successfully
            </p>

            <a
                href="${portfolioURL}"
                target="_blank"
                class="text-blue-400 underline break-all">

                ${portfolioURL}

            </a>
        </div>
    `;

    alert("Portfolio Generated Successfully");

}
catch (error) {

    console.error(error);
    alert(error.message);

}
```

}
