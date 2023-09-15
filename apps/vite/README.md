# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

# Notes:

1. Scaffold

> Start terminal in SAPDevelop

```sh
npm create vite@latest devtoberfest-ui5wcr -- --template react-ts
```

> install deps and show `npm run dev`

2. Install deps

```sh
npm install @ui5/webcomponents-react @ui5/webcomponents @ui5/webcomponents-fiori
npm install prettier -D
```

3. Run App
4. Add ThemeProvider and Assets

```
import '@ui5/webcomponents-react/dist/Assets.js';
```

5. Delete Content of main.tsx & add ShellBar

```
  <ShellBar
    primaryTitle="Movie DB"
    logo={
      <img
        src="https://sap.github.io/ui5-webcomponents/assets/images/sap-logo-svg.svg"
        alt="SAP Logo"
      />
    }
    onLogoClick={handleLogoClick}
  />
```

6. Replace styles in App.css

App:

```css
#root {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--sapBackgroundColor);
}
```

index:

```css
body {
  margin: 0;
}
```

6.1 Set to use Horizon (explain later)

```html
<script data-ui5-config type="application/json">
  {
    "theme": "sap_horizon"
  }
</script>
```

7. Install React Router

```sh
npm i react-router-dom
```

7.1. `BrowserRouter` in `main.tsx`
7.2. Routes in `App.tsx` & container div

```tsx
<div style={{ overflow: "auto", flexGrow: 1 }}>
  <Routes>
    <Route path="details/:movieId" element={<Details />} />
    <Route path="/" element={<Home />} />
  </Routes>
</div>
```

7.3. Create empty components and import in `App.tsx`
7.4. Navigate to `/details` (URL)
7.5. Navigate home by logo click

```ts
const navigate = useNavigate();
const handleLogoClick = () => {
  navigate("/");
};
```

8. Home

8.1 replace div with FlexBox
8.2 add Input
8.3 add Table & mockData

Render:

```jsx
<FlexBox direction={FlexBoxDirection.Column}>
  <Input />
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
  >
    {mockData.map((movie) => {
      return (
        <TableRow key={movie.id}>
          <TableCell>{movie.title}</TableCell>
          <TableCell>{movie.year}</TableCell>
          <TableCell>{movie.revenue}</TableCell>
        </TableRow>
      );
    })}
  </Table>
</FlexBox>
```

mock:

```ts
const mockData = [
  {
    id: "1",
    title: "Avatar",
    year: 2009,
    //todo
    revenue: 1337,
  },
  {
    id: "2",
    title: "Avengers: Endgame",
    year: 2019,
    //todo
    revenue: 7742,
  },
];
```

8.4 `useResponsiveContentPadding` + `paddingBlock: "1rem"`

8.5 create format function `utils.ts`

```ts
export const revenueFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 3,
});
```

```jsx
<TableCell>{revenueFormatter.format(movie.revenue)}</TableCell>
```

9. Make Table interactive

9.1 Add `type={TableRowType.Active}` to row & add `data-id={movie.id}`
9.2 Add handler with navigate

```ts
const handleRowClick = (e) => {
  const { row } = e.detail;
  navigate(`/details/${row.dataset.id}`);
};
```

10. Add TanStack Query

```sh
npm i @tanstack/react-query
```

10.1. `main.tsx`

```ts
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
```

```
<QueryClientProvider client={queryClient}>
```

11. Read all movies list from backend

```ts
const { isLoading, error, data } = useQuery({
  queryKey: ["tableData"],
  queryFn: () =>
    fetch(
      "https://devtoberfest-movie-database.cfapps.eu10-004.hana.ondemand.com/api/v1/movies/",
    ).then((res) => {
      return res.json();
    }),
});
```

12. wrap `Table` in `BusyIndicator`

```tsx
  <BusyIndicator active={isLoading}>
```

13. Implement frontend search

```ts
const [filteredData, setFilteredData] = useState(data);
```

```ts
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
```

```tsx
<Input
  placeholder="Search Movies"
  onInput={handleSearchInput}
  icon={<Icon name={searchIcon} />}
  style={{ width: "300px" }}
/>
```

14. Read details from backend

```ts
const { movieId } = useParams();
const { isLoading, error, data } = useQuery({
  queryKey: [`tableData${movieId}`],
  queryFn: () =>
    fetch(
      `https://devtoberfest-movie-database.cfapps.eu10-004.hana.ondemand.com/api/v1/movies/${movieId}`,
    ).then((res) => {
      return res.json();
    }),
});
```

15. Implement ObjectPage

```tsx
<ObjectPage style={{ height: "100%" }}>
  <ObjectPageSection id="summary" titleText="Summary"></ObjectPageSection>
  <ObjectPageSection id="actors" titleText="Main Actors"></ObjectPageSection>
  <ObjectPageSection id="reviews" titleText="Reviews"></ObjectPageSection>
</ObjectPage>
```

15.1 Add `image` & `headerTitle`

```ts
import pictureIcon from "@ui5/webcomponents-icons/dist/picture";
```

```tsx
    <ObjectPage
      style={{ height: "100%" }}
      image={<Avatar icon={pictureIcon}></Avatar>}
      showTitleInHeaderContent
      headerTitle={
        <DynamicPageTitle
          header={data?.title}
          subHeader={
            data?.revenue && (
              <>
                <Label showColon>Revenue</Label>{" "}
                <Text>{revenueFormatter.format(data.revenue)}</Text>
              </>
            )
          }
          showSubHeaderRight={false}
        >
          <RatingIndicator />
        </DynamicPageTitle>
      }
      // todo remove after ui5wcr update
      headerContent={<DynamicPageHeader />}
    >
      <ObjectPageSection id="summary" titleText="Summary"></ObjectPageSection>
      <ObjectPageSection
        id="actors"
        titleText="Main Actors"
      ></ObjectPageSection>
      <ObjectPageSection id="reviews" titleText="Reviews"></ObjectPageSection>
    </ObjectPage>
  );
```

15.2 Add movie images

--> copy paste images in `assets/moviePictograms`

15.3 import images and create list

```ts
import movieLogo1 from "./assets/281304_Clapperboard_R_blue.png";
import movieLogo2 from "./assets/281304_Clapperboard_R_green.png";
import movieLogo3 from "./assets/281304_Clapperboard_R_orange.png";
import movieLogo4 from "./assets/281304_Clapperboard_R_purple.png";

const movieLogos = [movieLogo1, movieLogo2, movieLogo3, movieLogo4];
```

15.4 apply to `Avatar`

```tsx
<img src={movieLogos[data?.id % 4]} alt="Movie Thumbnail" />
```

16. Add Summary content

```tsx
<Text>data?.summary</Text>
```

17. Add Main Actors content

17.1 Add Section

```tsx
<Grid defaultSpan="XL6 L6 M6 S12">
  {data?.actors?.map((item, index) => (
    <FlexBox alignItems={FlexBoxAlignItems.Center} key={item.name}>
      <Avatar
        size={AvatarSize.L}
        style={{ marginInlineEnd: "0.5rem" }}
        shape={AvatarShape.Square}
      >
        <img src={personAvatars[index % 6]} alt="Picture of Actor" />
      </Avatar>
      <FlexBox direction={FlexBoxDirection.Column}>
        <Text style={{ fontFamily: ThemingParameters.sapFontBoldFamily }}>
          {item.name}
        </Text>
        <Label>{item.character}</Label>
      </FlexBox>
    </FlexBox>
  ))}
</Grid>
```

17.2
--> copy paste images in `assets/personPictograms`

```ts
import person1 from "./assets/personPictograms/person1.svg";
import person2 from "./assets/personPictograms/person2.png";
import person3 from "./assets/personPictograms/person3.png";
import person4 from "./assets/personPictograms/person4.png";
import person5 from "./assets/personPictograms/person5.png";
```

17.3 use in Avatar

```tsx
<img src={personAvatars[index % 6]} alt="Picture of Actor" />
```

18. Add Reviews Content

18.1 Fetch review data

```ts
const {
  // isLoading,
  // error,
  data: reviewData,
} = useQuery({
  queryKey: [`tableData${movieId}`],
  queryFn: () =>
    fetch(
      `https://devtoberfest-movie-database.cfapps.eu10-004.hana.ondemand.com/api/v1/movies/${movieId}/reviews`,
    ).then((res) => {
      return res.json();
    }),
});
```

18.2 Add value to RatingIndicator

todo: backend?

```tsx
<RatingIndicator
  value={reviewData?.reduce((acc, cur) => {
    acc += cur.rating;
    return acc / 2;
  }, 0)}
/>
```

18.3 Implement Timeline

```tsx
<Timeline>
  {reviewData?.map((item) => {
    const date = new Date(item.timestamp);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    return (
      <TimelineItem
        key={item.timestamp}
        name={item.name}
        subtitleText={formattedDate}
        icon={personPlaceholder}
      >
        <FlexBox direction={FlexBoxDirection.Column}>
          <Text>{item.comment}</Text>
          {item.rating && <RatingIndicator value={item.rating} readonly />}
        </FlexBox>
      </TimelineItem>
    );
  })}
</Timeline>
```

18.4 Implement custom header with create-review btn

```tsx
<ObjectPageSection
        id="reviews"
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
```

18.5 Create Dialog component `CreateReviewDialog.tsx`

```tsx
import { Dialog } from "@ui5/webcomponents-react";
import { createPortal } from "react-dom";

export const CreateReviewDialog = (props) => {
  return createPortal(<Dialog open>Content</Dialog>, document.body);
};
```

18.6. Import CreateReviewDialog & add props (`Details.tsx`)

```ts
const [dialogOpen, setDialogOpen] = useState(false);
```

```tsx
<CreateReviewDialog
  onClose={handleDialogClose}
  movieTitle={data?.title}
  movieId={data?.id}
  open={dialogOpen}
/>
```

```ts
const handleCreateReviewClick = () => {
  setDialogOpen(true);
};
const handleDialogClose = () => {
  setDialogOpen(false);
};
```

19. `CreateReviewDialog.tsx`

19.1 Add props

```tsx
    <Dialog
        open={open}
        onAfterClose={onClose}
        headerText={`Add your Review for "${movieTitle}"`}
```

19.2 Add content

```tsx
<Form labelSpanS={12} labelSpanM={12} labelSpanL={12} labelSpanXL={12}>
  <FormItem label="Name">
    <Input style={{ width: "100%" }} />
  </FormItem>
  <FormItem label="Rating">
    <RatingIndicator />
  </FormItem>
  <FormItem
    label={
      <Label showColon required>
        Comment
      </Label>
    }
  >
    <TextArea rows={5} growingMaxLines={10} growing required />
  </FormItem>
</Form>
```

19.3 Add footer

```tsx
      footer={
        <Bar
          design={BarDesign.Footer}
          endContent={
            <>
              <Button design={ButtonDesign.Emphasized}>Submit</Button>
              <Button design={ButtonDesign.Transparent}>Cancel</Button>
            </>
          }
        ></Bar>
      }
```

19.4 Prevent double padding (`::part`)

```tsx
 <Dialog
      className="footerNoPadding"
```

`App.css`

```css
.footerNoPadding::part(footer) {
  padding-inline: 0;
}
```

19.5 Add logic

19.5.1 Bar

```tsx
<Bar
  design={BarDesign.Footer}
  endContent={
    <>
      <Button design={ButtonDesign.Emphasized} onClick={handleSave}>
        Submit
      </Button>
      <Button design={ButtonDesign.Transparent} onClick={onClose}>
        Cancel
      </Button>
    </>
  }
></Bar>
```

19.5.2 Reducer

```ts
function reducer(state, action) {
  const { field, value } = action;
  return { ...state, [field]: value };
}
```

```ts
const [fields, dispatch] = useReducer<
  {
    name: string;
    rating: number;
    comment: string;
  },
  never
>(reducer, {
  name: "",
  rating: 0,
  comment: "",
});
```

```tsx
  <FormItem label="Name">
    <Input
      value={fields.name}
      data-field="name"
      style={{ width: "100%" }}
      onInput={handleInput}
    />
  </FormItem>
  <FormItem label="Rating">
    <RatingIndicator
      value={fields.rating}
      data-field="rating"
      onChange={handleInput}
    />
  </FormItem>
  <FormItem
    label={
      <Label showColon required>
        Comment
      </Label>
    }
  >
    <TextArea
      ref={textAreaRef}
      value={fields.comment}
      data-field="comment"
      rows={5}
      growingMaxLines={10}
      growing
      required
      onInput={handleInput}
    />
  </FormItem>
```

```ts
const handleInput = (e) => {
  dispatch({ field: e.target.dataset.field, value: e.target.value });
};
```

19.5.3 Validation

```ts
const [textAreaErrorState, setTextAreaErrorState] = useState(false);
```

```ts
const handleSave = () => {
  if (fields.comment) {
    const payload = {
      name: (fields.name ||= "Anonymous"),
      rating: fields.rating,
      comment: fields.comment,
    };
    console.log(payload);
    setTextAreaErrorState(false);
  } else {
    setTextAreaErrorState(true);
    textAreaRef.current.focus();
  }
};
```

19.6 POST review

```ts
const mutation = useMutation({
  mutationFn: async (newFields) => {
    const response = await fetch(
      `https://devtoberfest-movie-database.cfapps.eu10-004.hana.ondemand.com/api/v1/movies/${movieId}/reviews`,
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify(newFields),
        method: "POST",
      },
    );
    if (!response.ok) {
      throw await response.json();
    }
  },
  onSuccess: () => {
    queryClient.invalidateQueries([`reviews-${movieId}`]);
  },
});
```

19.7. Rating Indicator Validation + Close

```tsx
{
  mutation.isError && (
    <MessageStrip
      design={MessageStripDesign.Negative}
      hideCloseButton
      style={{ paddingBlockEnd: "0.5rem" }}
    >
      {mutation.error.error}
    </MessageStrip>
  );
}
```

```tsx
<RatingIndicator
  ref={ratingIndicatorRef}
  value={fields.rating}
  data-field="rating"
  onChange={handleInput}
  required
/>
```

```ts
  onSuccess: () => {
    queryClient.invalidateQueries([`reviews-${movieId}`]);
    dispatch("reset");
    onClose();
}
onError: ({ error }) => {
    if (
        error ===
        "The rating field is required and must be a number between 1 and 5"
    ) {
        ratingIndicatorRef.current.focus();
    }
},
```

```tsx
const handleSave = () => {
  if (fields.comment) {
    const payload = {
      name: (fields.name ||= "Anonymous"),
      rating: fields.rating,
      comment: fields.comment,
    };
    mutation.mutate(payload);
    setTextAreaErrorState(false);
  } else {
    setTextAreaErrorState(true);
    textAreaRef.current.focus();
  }
};
```

20. Theming `App.tx`

```ts
import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js";
```

```ts
const defaultTheme = "sap_horizon";
export const ThemeContext = createContext(defaultTheme);
```

```ts
const [theme, setThemeState] = useState(defaultTheme);
```

```tsx
    <ThemeContext.Provider value={theme}>
```

```tsx
<ShellBarItem icon={paletteIcon} onClick={handleShellBarItemClick} />
```

```tsx
<Popover
  ref={popoverRef}
  placementType={PopoverPlacementType.Bottom}
  className="contentNoPadding"
>
  <List mode={ListMode.SingleSelect} onSelectionChange={handleThemeSwitch}>
    {themes.map((item) => (
      <StandardListItem
        data-key={item.key}
        key={item.key}
        selected={theme === item.key}
      >
        {item.name}
      </StandardListItem>
    ))}
  </List>
</Popover>
```

--> className (`App.css`):

```css
.contentNoPadding::part(content) {
  padding: 0;
}
```

--> handler

```tsx
const handleShellBarItemClick = (e) => {
  const { targetRef } = e.detail;
  popoverRef.current.showAt(targetRef);
};

const handleThemeSwitch = (e) => {
  const { targetItem } = e.detail;
  setTheme(targetItem.dataset.key);
  setThemeState(targetItem.dataset.key);
};
```

21. Dark-Mode pictograms (`Details.tsx`)

```ts
const movieAvatars = [movieLogo1, movieLogo2, movieLogo3, movieLogo4];

const movieAvatarsDark = [
  movieLogo1dark,
  movieLogo2dark,
  movieLogo3dark,
  movieLogo4dark,
];

const personAvatars = [person1, person2, person3, person4, person5];

const personAvatarsDark = [
  person1dark,
  person2dark,
  person3dark,
  person4dark,
  person5dark,
];
```

```ts
const theme = useContext(ThemeContext);
const isDarkMode = theme.includes("dark") || theme.includes("hcb");
const movieImages = isDarkMode ? movieAvatarsDark : movieAvatars;
const personImages = isDarkMode ? personAvatarsDark : personAvatars;
```

```tsx
<img src={movieImages[data?.id % 4]} alt="Movie Thumbnail" />

<img src={personImages[index % 6]} alt="Picture of Actor" />
```
