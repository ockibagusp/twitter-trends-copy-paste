// methods
export function btnCopy() {
    if (props.results == "" || props.results == "Tidak ada hasil") {
        return;
    }

    const tmpResultsField = document.getElementById("results");
    tmpResultsField.select();
    // Untuk perangkat seluler
    tmpResultsField.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(props.results);
}
