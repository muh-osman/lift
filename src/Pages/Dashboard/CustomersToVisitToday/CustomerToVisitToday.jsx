import style from "./CustomerToVisitToday.module.scss";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
// Api
import useGetOneClientDataApi from "../../../API/useGetOneClientDataApi";

export default function CustomerToVisitToday() {
  const { data: client, fetchStatus, isSuccess } = useGetOneClientDataApi();

  return (
    <div className={style.container}>
      {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      <div className={style.table_container} dir="rtl">
        <table>
          <tbody>
            <tr>
              <td>اسم العميل:</td>
              <td>{client?.name}</td>
            </tr>

            <tr>
              <td>رقم الهاتف:</td>
              <td>{client?.phone_number}</td>
            </tr>

            <tr>
              <td>الحي:</td>
              <td>{client?.neighborhood}</td>
            </tr>

            <tr>
              <td>الصيانة:</td>
              <td>{client?.maintenance_type}</td>
            </tr>

            <tr>
              <td>قطع الغيار:</td>
              <td>{client?.spare_parts}</td>
            </tr>

            <tr>
              <td>نوع الخدمة:</td>
              <td>{client?.service_type}</td>
            </tr>

            <tr>
              <td>بداية العقد:</td>
              <td>{client?.contract_start_date}</td>
            </tr>

            <tr>
              <td>نهاية العقد:</td>
              <td>{client?.contract_end_date}</td>
            </tr>

            <tr>
              <td>قيمة الصيانة:</td>
              <td>
                {client?.maintenance_value !== undefined
                  ? Math.floor(client.maintenance_value)
                  : ""}
              </td>
            </tr>

            <tr>
              <td>مدفوع:</td>
              <td>
                {client?.paid !== undefined ? Math.floor(client.paid) : ""}
              </td>
            </tr>

            <tr>
              <td>غير مدفوع:</td>
              <td>
                {client?.unpaid !== undefined ? Math.floor(client.unpaid) : ""}
              </td>
            </tr>

            <tr>
              <td>ملاحظات:</td>
              <td>
                {isSuccess &&
                  (client?.notes ? (
                    client.notes
                  ) : (
                    <span style={{ color: "#757575" }}>لا توجد ملاحظات</span>
                  ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
