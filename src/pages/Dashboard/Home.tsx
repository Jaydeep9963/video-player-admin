import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import PageMeta from "../../components/common/PageMeta";
import RecentOrders from "../../components/ecommerce/RecentOrders";
// import DemographicCard from "../../components/ecommerce/DemographicCard";
// import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
// import StatisticsChart from "../../components/ecommerce/StatisticsChart";
// import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";

export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 mb-6 xl:col-span-7">
          <EcommerceMetrics />
          {/* <MonthlySalesChart /> */}
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>

        {/* <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div> */}

        {/* <div className="col-span-12">
          <StatisticsChart />
        </div> */}

        {/* <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div> */}
      </div>
    </>
  );
}
