import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  FlexBox,
  FlexBoxDirection,
  Icon,
  Input,
  InputPropTypes,
  Table,
  TableCell,
  TableColumn,
  TablePropTypes,
  TableRow,
  TableRowType
} from "@ui5/webcomponents-react";
import { useResponsiveContentPadding } from "@ui5/webcomponents-react-base";
import { revenueFormatter } from "../utils";
import searchIcon from "@ui5/webcomponents-icons/dist/search.js";

interface Props {
  movies: {
    id: string;
    title: string;
    year: number;
    revenue: number;
  }[];
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const movieResponse = await fetch(
    "https://devtoberfest-movie-database.cfapps.eu10-004.hana.ondemand.com/api/v1/movies"
  );
  if (movieResponse.ok) {
    return {
      props: {
        movies: await movieResponse.json()
      }
    };
  }

  return {
    props: {
      movies: []
    }
  };
};

export default function Home({ movies }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const containerRef = useRef(null);
  const router = useRouter();
  const responsivePaddingClass = useResponsiveContentPadding(
    containerRef.current!
  );

  const [filteredData, setFilteredData] = useState(movies);

  const handleRowClick: TablePropTypes["onRowClick"] = (e) => {
    const { row } = e.detail;
    router.push(`/details/${row.dataset.id}`);
  };
  const handleSearchInput: InputPropTypes["onInput"] = (e) => {
    const { value } = e.target;
    setFilteredData(
      movies.filter(
        (item) =>
          item.title.toLowerCase().includes(value!.toLowerCase()) ||
          String(item.year).includes(value!)
      )
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
    </FlexBox>
  );
}
