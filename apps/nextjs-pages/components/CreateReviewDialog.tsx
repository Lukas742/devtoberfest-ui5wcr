import {
  Bar,
  BarDesign,
  Button,
  ButtonDesign,
  Dialog,
  Form,
  FormItem,
  Input,
  Label,
  MessageStrip,
  MessageStripDesign,
  RatingIndicator,
  RatingIndicatorDomRef,
  TextArea,
  TextAreaDomRef,
  ValueState
} from "@ui5/webcomponents-react";
import { useReducer, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const initialFields = {
  name: "",
  rating: 0,
  comment: ""
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

function useAddReviewComment(movieId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: typeof initialFields) => {
      const response = await fetch(
        `https://devtoberfest-movie-database.cfapps.eu10-004.hana.ondemand.com/api/v1/movies/${movieId}/reviews`,
        {
          headers: {
            accept: "application/json",
            "content-type": "application/json"
          },
          body: JSON.stringify(payload),
          method: "POST"
        }
      );
      if (!response.ok) {
        throw (await response.json()) as { error: string };
      }
    },
    onSuccess() {
      queryClient.invalidateQueries(["movies", movieId, "reviews"]);
    },
    onError: (error: { error: string }) => {
      console.error("Failed to create new review", error);
    }
  });
}

interface CreateReviewDialogPropTypes {
  movieId: string;
  movieTitle: string;
  open: boolean;
  onClose: () => void;
}

export const CreateReviewDialog = (props: CreateReviewDialogPropTypes) => {
    const { movieId, movieTitle, onClose, open } = props;
    const textAreaRef = useRef<TextAreaDomRef>(null);
    const ratingIndicatorRef = useRef<RatingIndicatorDomRef>(null);
    const [textAreaErrorState, setTextAreaErrorState] = useState(false);
    const [fields, dispatch] = useReducer(reducer, initialFields);

    const addReview = useAddReviewComment(movieId);

    const handleInput = (e: any) => {
      dispatch({ field: e.target.dataset.field!, value: e.target.value! });
    };

    const handleSave = () => {
      if (fields.comment) {
        const payload = {
          name: fields.name,
          rating: fields.rating,
          comment: fields.comment
        };
        addReview.mutate(payload, {
          onSuccess: () => {
            dispatch("reset");
            onClose();
          },
          onError: (error) => {
            if (error.error === "The rating field is required and must be a number between 1 and 5") {
              ratingIndicatorRef.current?.focus();
            }
          }
        });
        setTextAreaErrorState(false);
      } else {
        setTextAreaErrorState(true);
        textAreaRef.current?.focus();
      }
    };

    if (!open) {
      return null;
    }

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
        {addReview.isError && (
          <MessageStrip
            design={MessageStripDesign.Negative}
            hideCloseButton
            style={{ paddingBlockEnd: "0.5rem" }}
          >
            {addReview.error.error}
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
      document.body
    );
  }
;
