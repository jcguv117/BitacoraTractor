import DataTable from "react-data-table-component";
import movies from "../movies";

function getNumberOfPages(rowCount, rowsPerPage) {
  return Math.ceil(rowCount / rowsPerPage);
}

function toPages(pages) {
  const results = [];

  for (let i = 1; i < pages; i++) {
    results.push(i);
  }

  return results;
}

const columns = [
  {
    name: "Title",
    selector: (row) => row.title,
    sortable: true
  },
  {
    name: "Directior",
    selector: (row) => row.director,
    sortable: true
  },
  {
    name: "Runtime (m)",
    selector: (row) => row.runtime,
    sortable: true,
    right: true
  },
  {
    button: true,
    cell: () => (
      <div className="App">
        <div class="openbtn text-center">
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#myModal"
          >
            Open modal
          </button>
          <div class="modal" tabindex="-1" id="myModal">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Modal title</h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <p>Modal body text goes here.</p>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" class="btn btn-primary">
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
];



export default function ReactDataTable() {
  return (
    <div className="App">
      <div className="card">
        <DataTable
          title="Movies"
          columns={columns}
          data={movies}
          defaultSortFieldID={1}
        />
      </div>
    </div>
  );
}

