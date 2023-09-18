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

# Scaffold (before Recording)

> Start terminal in SAPDevelop

```sh
npm create vite@latest devtoberfest-ui5wcr -- --template react-ts
```

2. Install all deps (routing, data fetching, wcr)

```sh
npm install @ui5/webcomponents-react @ui5/webcomponents @ui5/webcomponents-fiori react-router-dom @tanstack/react-query
npm install prettier -D
```

# Demo start

# Run App `npm run dev`

# Add ThemeProvider and Assets

```
import '@ui5/webcomponents-react/dist/Assets.js';
```

# Delete Content of main.tsx & add ShellBar

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

# Replace styles in App.css

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

## Set to use Horizon (explain later)

```html
<script data-ui5-config type="application/json">
  {
    "theme": "sap_horizon"
  }
</script>
```

## Add React Router

 `<BrowserRouter>` in `main.tsx`
 
## Routes in `App.tsx` & container div

```tsx
<div style={{ overflow: "auto", flexGrow: 1 }}>
  <Routes>
    <Route path="details/:movieId" element={<Details />} />
    <Route path="/" element={<Home />} />
  </Routes>
</div>
```

## Create empty components and import in `App.tsx`

## Navigate to `/details/1` (URL)

## Navigate home by logo click

```ts
const navigate = useNavigate();
const handleLogoClick = () => {
  navigate("/");
};
```

# Home component

## add Table & mockData

Render:

```jsx
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
```

mock:

```ts
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
```

## `useResponsiveContentPadding` + `paddingBlock: "1rem"`


```ts
       <div
      ref={containerRef}
      className={responsivePaddingClass}
      style={{ paddingBlock: "1rem" }}
    >
```

## create format function `utils.ts`

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

# Make Table interactive

## Add `type={TableRowType.Active}` to row & add `data-id={movie.id}`

## Add handler with navigate

```ts
const handleRowClick = (e) => {
  const { row } = e.detail;
  navigate(`/details/${row.dataset.id}`);
};
```

# Fetch data / Integrate TanStack Query

```ts
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
```

```
<QueryClientProvider client={queryClient}>
```

# Read all movies list from backend

```ts
const { data=[] } = useQuery({
  queryKey: ["tableData"],
  queryFn: () =>
    fetch(
      "https://devtoberfest-movie-database.cfapps.eu10-004.hana.ondemand.com/api/v1/movies/",
    ).then((res) => {
      return res.json();
    }),
});
```

# Read details from backend

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

add Interface

```ts
interface Details {
  id: string;
  title: string;
  revenue: number;
  actors: string[];
  summary: string;
  rating: number;
  year: number;
}
```
# 15. Implement ObjectPage

```tsx
<ObjectPage style={{ height: "100%" }}>
  <ObjectPageSection id="summary" titleText="Summary"></ObjectPageSection>
  <ObjectPageSection id="actors" titleText="Main Actors"></ObjectPageSection>
  <ObjectPageSection id="reviews" titleText="Reviews"></ObjectPageSection>
</ObjectPage>
```

## Add `headerTitle`

```tsx
headerTitle={<DynamicPageTitle header={data?.title} />}
```

## Add `headerContent`

```tsx
      headerContent={
        <DynamicPageHeader>
          <FlexBox direction={FlexBoxDirection.Column}>
            <Link>Official Trailer</Link>
            <Link>Buy Online</Link>
          </FlexBox>
        </DynamicPageHeader>
      }
```

## Add `image`

```ts
import pictureIcon from "@ui5/webcomponents-icons/dist/picture";
```

```tsx
    <ObjectPage
      style={{ height: "100%" }}
      image={<Avatar icon={pictureIcon}></Avatar>}
     ..
    >
```

## Enhance Title and add `showTitleInHeaderContent`

```tsx
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
          {data?.rating && <RatingIndicator value={data?.rating} />}
        </DynamicPageTitle>
      }
```

# Add Summary content

```tsx
<Text>{data?.summary}</Text>
```

# Add Main Actors content

## Map actors

```tsx
    {data?.actors.map((actor) => (
          <FlexBox direction={FlexBoxDirection.Column} key={actor.name}>
            <Text style={{fontFamily: ThemingParameters.sapFontBoldFamily}}>{actor.name}</Text>
            <Label>{actor.character}</Label>
          </FlexBox>
        ))}
```

## Add image

```ts
import person1 from "./assets/personPictograms/person1.svg";
import person2 from "./assets/personPictograms/person2.png";
import person3 from "./assets/personPictograms/person3.png";
import person4 from "./assets/personPictograms/person4.png";
import person5 from "./assets/personPictograms/person5.png";

const personAvatars = [person1, person2, person3, person4, person5];
```

```tsx
        {data?.actors.map((actor, index) => (
          <FlexBox alignItems={FlexBoxAlignItems.Center} key={actor.name}>
            <Avatar
              size={AvatarSize.L}
              style={{ marginInlineEnd: "0.5rem" }}
              shape={AvatarShape.Square}
            >
              <img src={personAvatars[index % 6]} alt="Picture of Actor" />
            </Avatar>
            <FlexBox direction={FlexBoxDirection.Column} key={actor.name}>
              <Text style={{ fontFamily: ThemingParameters.sapFontBoldFamily }}>
                {actor.name}
              </Text>
              <Label>{actor.character}</Label>
            </FlexBox>
          </FlexBox>
        ))}
```

## Add Grid

```tsx
<Grid defaultSpan="XL6 L6 M6 S12">
```

# Add Reviews Content

## Fetch review data

```ts
const {
  data: reviewData,
} = useQuery({
  queryKey: [`tableData${movieId}Review`],
  queryFn: () =>
    fetch(
      `https://devtoberfest-movie-database.cfapps.eu10-004.hana.ondemand.com/api/v1/movies/${movieId}/reviews`,
    ).then((res) => {
      return res.json();
    }),
});
```

## Show review data

```tsx
  {reviewData?.map((item) => (<div>{item.comment}</div>))}
```

## Add Timeline

```tsx
        <Timeline>
          {reviewData?.map((item) => {
            return <TimelineItem>{item.comment}</TimelineItem>;
          })}
        </Timeline>
```

## Improve Timeline

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

# Create Review

> Cut here and copy/paste implementation

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

# Theming `App.tx`

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

# Dark-Mode pictograms (`Details.tsx`)

```ts
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
const personImages = isDarkMode ? personAvatarsDark : personAvatars;
```

```tsx
<img src={personImages[index % 6]} alt="Picture of Actor" />
```
