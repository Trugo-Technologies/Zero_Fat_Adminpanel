import fs from "fs";
import path from "path";

/**  
  this is custom cli to create feature for this project 
  you can choose what the name of this feateure and type in terminal 
  **npm run generate {feature name}
  it will create folder with feature name and inside it three folders pages ,components and services
*/

function kebabToCamel(kebabString) {
  return kebabString.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
function generateFeature(featureName) {
  const allInitText = `
  import { usePaginateData } from "src/hooks/use-paginate-data";
  import { privilegeFeature } from "src/shared/privileges";
  import AuthorizedCheckWrapper, {
    ComponentPropsType,
  } from "src/components/authorized-check-wrapper";
  import {useGetAllQuery,useDeleteQuery} from "../services/api";
  import MainTable from "src/components/main-table";
  
  function ${kebabToCamel(
    `All-${featureName}`
  )}({ canEdit, canDelete }: ComponentPropsType) {
     const {
      changePage,
      data,
      isError,
      isFetching,
      limit,
      page,
      changeLimit,
      setSearchValue,
      totalRecords,
      handleDelete,
      refetch,
       } = usePaginateData(useGetAllQuery);
  
      const loading = isFetching
    const headers = [];
  
    const createData = (data) => {
      return { ...data };
    };
  
    const onDelete = (id: string) => {
      delete(id)
        .unwrap()
        .then(() => {
          handleDelete();
        });
    };
    const onSearch = (key: string) => setSearchValue(key);
    return (
      <MainTable
      feature={privilegeFeature}
      onAdd=""
      refetch={refetch}
      handleSearch={onSearch}
      title=""
      isError={isError}
      header={headers}
      rows={data?.data.map((d) => createData(d)) ?? []}
      totalRecords={totalRecords ?? 0}
      limit={limit}
      page={page}
      onPageChange={changePage}
      onLimitChange={changeLimit}
      loading={loading}
      action={{
        delete: canDelete ? onDelete : undefined,
        update: canEdit ? "/" : undefined,
      }}
    />
    );  
  }
  export default AuthorizedCheckWrapper({
    feature: privilegeFeature,
    type: "view",
  })(${kebabToCamel(`All-${featureName}`)});
    `;
  const addInitText = (type) => `
  import { FormikOnSubmitType, inputType } from "src/types";
  import GenerateForm from "src/components/generate-form-component";
  import { Yup } from "src/validation";
  import { DynamicFormTypeFields } from "src/types";
  import AuthorizedCheckWrapper from "src/components/authorized-check-wrapper";
  import { privilegeFeature } from "src/shared/privileges";
  import {${
    type === "add" ? "useAddMutation" : "useEditMutation"
  }  } from "../services/api";
  import { useNavigate } from "react-router-dom";
  import { showSuccessToasts } from "src/components/toasts";
  
  
  function  ${kebabToCamel(
    `${type === "add" ? "Add" : "Edit"}-${featureName}`
  )} (){
    const fields: DynamicFormTypeFields =[]

    const initialValues={}

    const validationSchema = Yup.object({})

    const onSubmit:FormikOnSubmitType<typeof initialValues> = async (
        values,
        {}
      ) => {}

      return (
        <GenerateForm
        title={("")}
        isMultiLanguage={false}
        fields={fields}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        isError={false}
        loading={false}
      />
      );}
      export default AuthorizedCheckWrapper({
        feature: privilegeFeature,
        type: "add",
      })(${kebabToCamel(`${type === "add" ? "Add" : "Edit"}-${featureName}`)});
  `;
  const apiInitText = `
  import { setSearchParams } from "src/helpers/set-search-params";
  import { api } from "src/redux-config/store";
  import { endPoints } from "src/shared/end-points";
  import { ArgsType } from "src/types";

  export type ${kebabToCamel(featureName)}Type = {
    id: string;
   
  };

  type ResType = {
   "currentPage": number;
  "totalPages": number;
  "totalCount": number;
  "pageSize": number;
  "hasPreviousPage": boolean;
  "hasNextPage": boolean;
    data: ${kebabToCamel(featureName)}Type[];
  };

  type ${kebabToCamel(featureName)}ById =  {};

  const apiService = api.enhanceEndpoints({ addTagTypes: [] }).injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAll: query<ResType, ArgsType>({
        providesTags: [],
        query: (props) => {
          const url = setSearchParams(endPoints, props);
          return { url: url.pathname + url.search };
        },
      }),
      add: mutation<void, any>({
        query: (data) => ({ url: endPoints, method: "POST", data }),
      }),
      edit: mutation<void, any>({
        query: ({ data, id }) => ({
          url: "endPoints/id",
          method: "PATCH",
          data,
        }),
      }),
      delete: mutation({
        query: (id) => ({ url: "{endPoints}/{id}", method: "DELETE" }),
      }),
    }),
  });
  export const { 
     useAddMutation,
    useDeleteMutation,
    useGetAllQuery,
    useEditMutation,}=apiService`;

  const featureDir = path.join("src", "app", featureName);
  const pages = path.join(featureDir, `pages`);
  const all = path.join(pages, `all-${featureName}.tsx`);
  const add = path.join(pages, `add-${featureName}.tsx`);
  const edit = path.join(pages, `edit-${featureName}.tsx`);
  const services = path.join(featureDir, `services`);
  const api = path.join(services, `api`);
  const slice = path.join(services, `slice`);
  const components = path.join(featureDir, `components`);
  const form = path.join(components, `${featureName}-form.tsx`);
  const apiFile = path.join(api, `index.ts`);

  fs.mkdirSync(featureDir, { recursive: true });
  fs.mkdirSync(pages, { recursive: true });
  fs.mkdirSync(services, { recursive: true });
  fs.mkdirSync(api, { recursive: true });
  fs.mkdirSync(slice, { recursive: true });
  fs.mkdirSync(components, { recursive: true });
  fs.writeFileSync(apiFile, apiInitText);
  fs.writeFileSync(all, allInitText);
  fs.writeFileSync(add, addInitText("add"));
  fs.writeFileSync(edit, addInitText("edit"));

  console.log(`Generated feature: ${featureName}`);
}

const featureName = process.argv[2];
generateFeature(featureName);
