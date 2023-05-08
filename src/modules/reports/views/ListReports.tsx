import { useEffect, useState } from "react";
import { Card, Form, Input, message, Select, DatePicker } from "antd";
import { getReports } from "../service/reports.service";
import { CollapseFolders } from "../components/CollapseFolders";
import { getListEnfermedades } from "../../../utils/api/api";
import { convertListToSelect } from "../../../utils/constants/convertToList";
import moment from "moment";
import { log } from "console";


export const ListReports = () => {
  const [form] = Form.useForm();
  const [folders, setFolders] = useState([]);
  const [clave, setClave] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [listEnfermedades, setListEnfermedades] = useState([{}]);
  const [valid, setValid] = useState(false);


  const listFolders = async (values: any) => {
    const date = moment(values?.fecha.toISOString()).format("YYYY-MM");
    const Data = `${values?.enfermedad};${date}`; 
    const resp = await getReports(Data);
    if (resp?.data[0]?.replace(/[\[\]]/g, "")) {
      setFolders(resp?.data[0]?.replace(/[\[\]]/g, "").split(","));
    } else {
      setFolders([]);
      messageApi.open({
        type: "error",
        content: "La clave del archivo no tiene carpetas existentes",
      });
    }
    setClave(Data);
  };

  const getListEnf = async () => {
    await getListEnfermedades().then(({ data }) => {
      const { status } = data;
      if (status && status == 200) {
        const list:[] = data.data;
        const { convert } = convertListToSelect(list);
        setListEnfermedades( convert );
      }
    });
  };

  useEffect(() => {
    getListEnf();
  }, [])

  const change = (value:any)=>{
    console.log(value);
    setValid(true);
  }
  

  return (
    <div className="container">
      {contextHolder}
      <Card
        title="Filtros"
        className="mt-3"
        actions={[
          <div key="button-search" className="d-flex justify-content-end me-3">
            <button
              onClick={() => {
                form.submit();
              }}
              className="btn btn-primary "
              type="submit"
              disabled={!valid}
            >
              Buscar
            </button>
          </div>,
        ]}
      >
        <Form
          name="ReportsFilters"
          layout="vertical"
          colon={false}
          onFinish={listFolders}
          form={form}
        >
          <div className="row align-items-center">
            <Form.Item label="Enfermedad" name="enfermedad">
              <Select options={listEnfermedades} onChange={change} />
            </Form.Item>
          </div>
          <div className="row align-items-center">
            <Form.Item name="fecha" noStyle>
              <DatePicker picker="month" onChange={change} />
              {/* <Input
                  placeholder="Clave del archivo"
                  onChange={({ target }) => setClave(target.value)}
                /> */}
            </Form.Item>
          </div>
        </Form>
      </Card>

      <Card title="Reportes" className="mt-3">
        <CollapseFolders
          clave={clave}
          listFolders={listFolders}
          folders={folders}
        />
      </Card>
    </div>
  );
};
