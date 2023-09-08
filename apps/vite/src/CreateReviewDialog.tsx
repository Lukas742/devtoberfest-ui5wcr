import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  Form,
  Input,
  FormItem,
  RatingIndicator,
  Label,
  TextArea,
  BarDesign,
  Bar,
  Button,
  ButtonDesign,
  ValueState,
  MessageStrip,
  MessageStripDesign,
} from "@ui5/webcomponents-react";
import { useReducer, useRef, useState } from "react";
import { createPortal } from "react-dom";

const initialFields = {
  name: "",
  rating: 0,
  comment: "",
};

function reducer(state: {
  name: string;
  rating: number;
  comment: string;
}, action: { field: string; value: string | number; } | "reset") {
  if (action === "reset") {
    console.log("reset");
    return initialFields;
  }
  const { field, value } = action;
  return { ...state, [field]: value };
}

export const CreateReviewDialog = (props) => {
  const { movieId, movieTitle, onClose, open } = props;
  const textAreaRef = useRef(null);
  const ratingIndicatorRef = useRef(null);
  const [textAreaErrorState, setTextAreaErrorState] = useState(false);
  const [fields, dispatch] = useReducer(reducer, initialFields);
  const queryClient = useQueryClient();
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
      dispatch("reset");
      onClose();
    },
    onError: ({ error }) => {
      if (
        error ===
        "The rating field is required and must be a number between 1 and 5"
      ) {
        ratingIndicatorRef.current.focus();
      }
    },
  });

  const handleInput = (e) => {
    dispatch({ field: e.target.dataset.field, value: e.target.value });
  };

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

  return createPortal(
    <Dialog
      className="footerNoPadding"
      open={open}
      onAfterClose={onClose}
      headerText={`Add your Review for "${movieTitle}"`}
      style={{ width: "50rem" }}
      footer={
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
        />
      }
    >
      {mutation.isError && (
        <MessageStrip
          design={MessageStripDesign.Negative}
          hideCloseButton
          style={{ paddingBlockEnd: "0.5rem" }}
        >
          {mutation.error.error}
        </MessageStrip>
      )}
      <Form labelSpanS={12} labelSpanM={12} labelSpanL={12} labelSpanXL={12}>
        <FormItem label="Name">
          <Input
            value={fields.name}
            data-field="name"
            style={{ width: "100%" }}
            onInput={handleInput}
          />
        </FormItem>
        <FormItem
          label={
            <Label showColon required>
              Rating
            </Label>
          }
        >
          <RatingIndicator
            ref={ratingIndicatorRef}
            value={fields.rating}
            data-field="rating"
            onChange={handleInput}
            required
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
            valueState={textAreaErrorState ? ValueState.Error : undefined}
            valueStateMessage={<span>Please add your review.</span>}
            rows={5}
            growingMaxLines={10}
            growing
            required
            onInput={handleInput}
          />
        </FormItem>
      </Form>
    </Dialog>,
    document.body,
  );
};
