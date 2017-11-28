// @flow

module.exports = (componentName) => {
    return `
        <form method="POST" action="/component/${componentName}">
            <textarea name="json"></textarea>
            <button>Submit</button>
        </form>
        `;
};
