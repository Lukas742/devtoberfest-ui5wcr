import {
  BusyIndicator,
  FlexBox,
  FlexBoxDirection,
  Icon,
  Input,
  Table,
  TableCell,
  TableColumn,
  TableRow,
  TableRowType,
} from "@ui5/webcomponents-react";
import { useResponsiveContentPadding } from "@ui5/webcomponents-react-base";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { revenueFormatter } from "./utils.ts";
import searchIcon from "@ui5/webcomponents-icons/dist/search";

const mockData = [
  {
    id: "1",
    title: "Avatar",
    year: 2009,
    revenue: 1337,
  },
  {
    id: "2",
    title: "Avengers: Endgame",
    year: 2019,
    revenue: 7742,
  },
];

export const Home = () => {
  const containerRef = useRef(null);
  const responsivePaddingClass = useResponsiveContentPadding(
    containerRef.current!,
  );
  const navigate = useNavigate();
  const { isLoading, data } = useQuery({
    queryKey: ["tableData"],
    queryFn: () =>
      fetch(
        "https://devtoberfest-movie-database.cfapps.eu10-004.hana.ondemand.com/api/v1/movies/",
      ).then((res) => {
        return res.json();
      }),
  });
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleRowClick = (e) => {
    const { row } = e.detail;
    navigate(`/details/${row.dataset.id}`);
  };
  const handleSearchInput = (e) => {
    const { value } = e.target;
    setFilteredData(
      data.filter(
        (item) =>
          item.title.toLowerCase().includes(value.toLowerCase()) ||
          String(item.year).includes(value),
      ),
    );
  };

  return (
    <FlexBox
      className={responsivePaddingClass}
      style={{ paddingBlock: "1rem" }}
      direction={FlexBoxDirection.Column}
      ref={containerRef}
    >
      <Input
        placeholder="Search Movies"
        onInput={handleSearchInput}
        icon={<Icon name={searchIcon} />}
        style={{ width: "300px" }}
      />
      <BusyIndicator active={isLoading}>
        <Table
          columns={
            <>
              <TableColumn>Title</TableColumn>
              <TableColumn minWidth={600} demandPopin popinText="Year">
                Year
              </TableColumn>
              <TableColumn minWidth={600} demandPopin popinText="Revenue">
                Revenue
              </TableColumn>
            </>
          }
          onRowClick={handleRowClick}
        >
          {filteredData?.map((movie) => {
            return (
              <TableRow
                key={movie.id}
                type={TableRowType.Active}
                data-id={movie.id}
              >
                <TableCell>{movie.title}</TableCell>
                <TableCell>{movie.year}</TableCell>
                <TableCell>{revenueFormatter.format(movie.revenue)}</TableCell>
              </TableRow>
            );
          })}
        </Table>
      </BusyIndicator>
    </FlexBox>
  );
};
