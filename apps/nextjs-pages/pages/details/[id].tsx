import {
  Avatar,
  AvatarShape,
  AvatarSize,
  Button,
  ButtonDesign,
  DynamicPageHeader,
  DynamicPageTitle,
  FlexBox,
  FlexBoxAlignItems,
  FlexBoxDirection,
  FlexBoxJustifyContent,
  Grid,
  Label,
  ObjectPage,
  ObjectPageSection,
  RatingIndicator,
  Text,
  Timeline,
  TimelineItem,
  Title,
  TitleLevel
} from "@ui5/webcomponents-react";
import { revenueFormatter } from "../../utils";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ThemingParameters } from "@ui5/webcomponents-react-base";
import personPlaceholder from "@ui5/webcomponents-icons/dist/person-placeholder.js";
import pictureIcon from "@ui5/webcomponents-icons/dist/picture.js";
import movieLogo1 from "../../assets/moviePictograms/clapperboard_blue.png";
import person1 from "../../assets/personPictograms/person1.svg";
import person2 from "../../assets/personPictograms/person2.png";
import person3 from "../../assets/personPictograms/person3.png";
import person4 from "../../assets/personPictograms/person4.png";
import person5 from "../../assets/personPictograms/person5.png";
//todo later
import movieLogo1dark from "../../assets/moviePictograms/clapperboard_blue_dark.png";
import movieLogo2 from "../../assets/moviePictograms/clapperboard_green.png";
import movieLogo2dark from "../../assets/moviePictograms/clapperboard_green_dark.png";
import movieLogo3 from "../../assets/moviePictograms/clapperboard_orange.png";
import movieLogo3dark from "../../assets/moviePictograms/clapperboard_orange_dark.png";
import movieLogo4 from "../../assets/moviePictograms/clapperboard_purple.png";
import movieLogo4dark from "../../assets/moviePictograms/clapperboard_purple_dark.png";
import person1dark from "../../assets/personPictograms/person1_dark.svg";
import person2dark from "../../assets/personPictograms/person2_dark.png";
import person3dark from "../../assets/personPictograms/person3_dark.png";
import person4dark from "../../assets/personPictograms/person4_dark.png";
import person5dark from "../../assets/personPictograms/person5_dark.png";
import Image from "next/image";
import { useState } from "react";
import { CreateReviewDialog } from "../../components/CreateReviewDialog";
import { dehydrate, DehydratedState, QueryClient, useQuery } from "@tanstack/react-query";
import { useThemeContext } from "../../context/ThemeContext";

const movieAvatars = [movieLogo1, movieLogo2, movieLogo3, movieLogo4];

const movieAvatarsDark = [
  movieLogo1dark,
  movieLogo2dark,
  movieLogo3dark,
  movieLogo4dark
];

const personAvatars = [person1, person2, person3, person4, person5];

const personAvatarsDark = [
  person1dark,
  person2dark,
  person3dark,
  person4dark,
  person5dark
];

type Review = {
  name?: string;
  timestamp: string;
  rating: number;
  comment: string;
};

interface Props {
  movieDetails: {
    id: string;
    year: number;
    title: string;
    revenue: number;
    actors: { name: string; character: string; }[];
    summary: string;
    rating: number;
  };
  dehydratedState: DehydratedState;
}

async function getReviewsForMovie(movieId: string): Promise<Review[]> {
  const response = await fetch(
    `https://devtoberfest-movie-database.cfapps.eu10-004.hana.ondemand.com/api/v1/movies/${movieId}/reviews`
  );
  if (response.ok) {
    return response.json();
  }
  return [];
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const movieId = ctx.query.id as string;

  const [movieResponse, reviews] = await Promise.all([fetch(
    `https://devtoberfest-movie-database.cfapps.eu10-004.hana.ondemand.com/api/v1/movies/${movieId}`
  ), getReviewsForMovie(movieId)]);

  if (!movieResponse.ok) {
    return {
      notFound: true
    };
  }
  const queryClient = new QueryClient();

  if (reviews) {
    await queryClient.prefetchQuery(["movies", movieId, "reviews"], () => reviews);
  }

  return {
    props: {
      movieDetails: await movieResponse.json(),
      dehydratedState: dehydrate(queryClient)
    }
  };
};


export default function MovieDetails(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { movieDetails } = props;
  const theme = useThemeContext();
  const isDarkMode = theme.includes("dark") || theme.includes("hcb");
  const movieImages = isDarkMode ? movieAvatarsDark : movieAvatars;
  const personImages = isDarkMode ? personAvatarsDark : personAvatars;

  const [dialogOpen, setDialogOpen] = useState(false);
  const handleCreateReviewClick = () => {
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const { data: reviews } = useQuery({
    queryKey: ["movies", movieDetails.id, "reviews"],
    queryFn: () => getReviewsForMovie(movieDetails.id)
  });

  return <>
    <ObjectPage
      style={{ height: "100%" }}
      image={
        <Avatar icon={pictureIcon}>
          {movieDetails?.id != null && (
            <Image src={movieImages[Number(movieDetails.id) % 4]} alt="Movie Thumbnail" />
          )}
        </Avatar>
      }
      showTitleInHeaderContent
      headerTitle={
        <DynamicPageTitle
          header={movieDetails?.title}
          subHeader={
            movieDetails?.revenue && (
              <>
                <Label showColon>Revenue</Label>{" "}
                <Text>{revenueFormatter.format(movieDetails.revenue)}</Text>
              </>
            )
          }
          showSubHeaderRight={false}
        >
          <RatingIndicator readonly value={movieDetails?.rating} />
        </DynamicPageTitle>
      }
      // todo remove after ui5wcr update
      headerContent={<DynamicPageHeader />}
    >
      <ObjectPageSection id="summary" titleText="Summary">
        <Text>{movieDetails?.summary}</Text>
      </ObjectPageSection>
      <ObjectPageSection id="actors" titleText="Main Actors">
        <Grid defaultSpan="XL6 L6 M6 S12">
          {movieDetails?.actors?.map((item, index) => (
            <FlexBox alignItems={FlexBoxAlignItems.Center} key={item.name}>
              <Avatar
                size={AvatarSize.L}
                style={{ marginInlineEnd: "0.5rem" }}
                shape={AvatarShape.Square}
              >
                <Image src={personImages[index % 6]} alt="Picture of Actor" />
              </Avatar>
              <FlexBox direction={FlexBoxDirection.Column}>
                <Text
                  style={{ fontFamily: ThemingParameters.sapFontBoldFamily }}
                >
                  {item.name}
                </Text>
                <Label>{item.character}</Label>
              </FlexBox>
            </FlexBox>
          ))}
        </Grid>
      </ObjectPageSection>
      <ObjectPageSection
        id="reviews"
        titleText="Reviews"
        hideTitleText
        header={
          <FlexBox
            justifyContent={FlexBoxJustifyContent.SpaceBetween}
            alignItems={FlexBoxAlignItems.Center}
          >
            <Title level={TitleLevel.H4}>REVIEWS</Title>
            <Button
              design={ButtonDesign.Emphasized}
              onClick={handleCreateReviewClick}
            >
              Create Review
            </Button>
          </FlexBox>
        }
      >
        <Timeline>
          {reviews?.map((item) => {
            const date = new Date(item.timestamp);
            const formattedDate = date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit"
            });
            return (
              <TimelineItem
                key={item.timestamp}
                name={item.name ?? "Anonymous"}
                subtitleText={formattedDate}
                icon={personPlaceholder}
              >
                <FlexBox direction={FlexBoxDirection.Column}>
                  <Text renderWhitespace>{item.comment}</Text>
                  <RatingIndicator value={item.rating} readonly />
                </FlexBox>
              </TimelineItem>
            );
          })}
        </Timeline>
      </ObjectPageSection>
    </ObjectPage>
    <CreateReviewDialog
      onClose={handleDialogClose}
      movieTitle={movieDetails.title}
      movieId={movieDetails.id}
      open={dialogOpen}
    />
  </>;
}