import {
  CreateTheConnectionLocal,
  DeleteConceptById,
  GetCompositionListListener,
  LocalSyncData,
  MakeTheInstanceConceptLocal,
  NORMAL,
  PatcherStructure,
  PRIVATE,
  UpdateComposition,
} from "mftsccs-browser";
import { StatefulWidget } from "../../default/StatefulWidget";
import "./crud.css";
import { getLocalUserId } from "../user/login.service";

export class crud extends StatefulWidget {
  cruddata: any = [];
  inpage: number = 10;
  page: number = 1;
  linker: string = "console_folder_s";

  widgetDidMount(): void {
    let userId: number = getLocalUserId();
    GetCompositionListListener(
      "the_crud",
      userId,
      this.inpage,
      this.page,
      NORMAL
    ).subscribe((output: any) => {
      this.cruddata = output;
      // console.log(output);
      this.render();
    });
  }
  addEvents(): void {
    let userId: number = getLocalUserId();

    let order = 1;
    let name = this.getElementById("name") as HTMLInputElement;
    let phone = this.getElementById("phone") as HTMLInputElement;
    let id = this.getElementById("id") as HTMLInputElement;

    if (this.data) {
      name.value = this.data.name;
      phone.value = this.data.phone;
      id.value = this.data.id;
    }

    let submitButton = this.getElementById("crudSubmit");
    if (submitButton) {
      submitButton.onclick = (ev: Event) => {
        ev.preventDefault();

        if (id.value) {
          let patcherStructure: PatcherStructure = new PatcherStructure();
          patcherStructure.compositionId = Number(id.value);
          patcherStructure.patchObject = {
            name: name.value,
            phone: phone.value,
          };
          UpdateComposition(patcherStructure);
        } else {
          MakeTheInstanceConceptLocal(
            "the_crud",
            "",
            true,
            userId,
            PRIVATE
          ).then((mainconcept) => {
            MakeTheInstanceConceptLocal(
              "name",
              name.value,
              false,
              userId,
              PRIVATE
            ).then((concept) => {
              MakeTheInstanceConceptLocal(
                "phone",
                phone.value,
                false,
                userId,
                PRIVATE
              ).then((concept2) => {
                CreateTheConnectionLocal(
                  mainconcept.id,
                  concept.id,
                  mainconcept.id,
                  order,
                  "",
                  userId
                ).then(() => {
                  CreateTheConnectionLocal(
                    mainconcept.id,
                    concept2.id,
                    mainconcept.id,
                    order,
                    "",
                    userId
                  ).then(() => {
                    LocalSyncData.SyncDataOnline();
                  });
                });
              });
            });
          });
        }
      };
    }

    //code for read/crud
    let tableElement = this.getElementById("mainbody");
    if (tableElement) {
      console.log("this is the element", tableElement);
      if (this.cruddata.length > 0) {
        for (let i = 0; i < this.cruddata.length; i++) {
          let id = this.cruddata[i].the_crud.id;

          // if the id is present and valid
          if (id) {
            let row = document.createElement("tr");
            let col1 = document.createElement("td");
            let col2 = document.createElement("td");
            let col3 = document.createElement("td");
            let col4 = document.createElement("td");
            let name = document.createElement("span");
            let nameValue = this.cruddata[i].the_crud.name;
            let phoneValue = this.cruddata[i].the_crud.phone;
            name.innerHTML = nameValue;
            let phone = document.createElement("span");
            phone.innerHTML = phoneValue;
            let edit = document.createElement("button");

            edit.setAttribute("class", "btn btn-primary");
            edit.setAttribute("padding", "10px");
            edit.id = this.cruddata[i].the_crud.id;
            edit.innerHTML = "edit";

            let del = document.createElement("button");
            del.setAttribute("class", "btn btn-primary");
            del.setAttribute("padding", "10px");
            del.id = this.cruddata[i].the_crud.id;
            del.innerHTML = "Delete";
            del.onclick = () => {
              if (id) {
                DeleteConceptById(id).then(() => {
                  console.log("this is the delete notify");
                });
              }
            };

            let that = this;
            edit.onclick = () => {
              that.data = {
                id: edit.id,
                name: nameValue,
                phone: phoneValue,
              };
              that.notify();
              console.log(
                "this is the update click",
                that.data,
                that.subscribers
              );
            };

            col1.append(name);
            col2.append(phone);
            col3.append(del);
            col4.append(edit);

            row.appendChild(col1);
            row.appendChild(col2);
            row.appendChild(col3);
            row.appendChild(col4);
            tableElement.append(row);
          }
        }
      }
    }
  }
  /**
   * This is the main html component of our creating widget.
   * @returns returns a form that takes in name and number for the phone book.
   */
  getHtml(): string {
    let html = "";
    html = `<div>
                <form class="form" id="addCrudForm">
                    <input type=number id="id" hidden>
                    <div>
                        <input type = text id="name" placeholder="name">
                    </div>
                    <div>
                        <input type = number id="phone" placeholder="phone">
                    </div>
                    <div>
                        <button type=submit id="crudSubmit" class="crud-btn">Add</button>
                    </div>
                </form>
                  <table>
                <thead>
                  <tr>
                      <th>name</th>
                      <th>phone</th>
                      <th>Delete</th>
                      <th>Edit</th>
                  </tr>
                </thead>
                <tbody id= mainbody>

                </tbody>
                </table>
                </div>`;
    return html;
  }
}
