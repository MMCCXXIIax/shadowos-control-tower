import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as desk from "./desk";

const fresh = { retry: 1, staleTime: 10_000 };

function onError(error: Error) {
  toast.error(error.message || "Supabase could not save that change");
}

export function useDesk(selectedId: string) {
  const client = useQueryClient();
  const configured = desk.isDeskConfigured();
  const refresh = (...keys: string[]) => keys.forEach(key => client.invalidateQueries({ queryKey: ["desk", key] }));

  const creatorsQuery = useQuery({ queryKey: ["desk", "creators"], queryFn: desk.listCreators, enabled: configured, retry: 1, staleTime: 30_000 });
  const evidenceQuery = useQuery({ queryKey: ["desk", "evidence", selectedId], queryFn: () => desk.listEvidence(selectedId), enabled: configured && Boolean(selectedId), ...fresh });
  const screeningQuery = useQuery({ queryKey: ["desk", "screening", selectedId], queryFn: () => desk.getScreening(selectedId), enabled: configured && Boolean(selectedId), ...fresh });
  const draftsQuery = useQuery({ queryKey: ["desk", "drafts"], queryFn: desk.listDrafts, enabled: configured, ...fresh });
  const followupsQuery = useQuery({ queryKey: ["desk", "followups"], queryFn: desk.listFollowups, enabled: configured, ...fresh });
  const productBriefsQuery = useQuery({ queryKey: ["desk", "briefs"], queryFn: desk.listBriefs, enabled: configured, ...fresh });
  const marketingPlansQuery = useQuery({ queryKey: ["desk", "plans"], queryFn: desk.listPlans, enabled: configured, ...fresh });
  const marketingItemsQuery = useQuery({ queryKey: ["desk", "items"], queryFn: desk.listItems, enabled: configured, ...fresh });
  const revenueProductsQuery = useQuery({ queryKey: ["desk", "products"], queryFn: desk.listProducts, enabled: configured, ...fresh });
  const revenueTermsQuery = useQuery({ queryKey: ["desk", "terms"], queryFn: desk.listTerms, enabled: configured, ...fresh });
  const revenueTransactionsQuery = useQuery({ queryKey: ["desk", "transactions"], queryFn: desk.listTransactions, enabled: configured, ...fresh });

  const addEvidenceMutation = useMutation({ mutationFn: desk.addEvidence, onSuccess: () => refresh("evidence"), onError });
  const saveScreeningMutation = useMutation({ mutationFn: desk.saveScreening, onSuccess: () => refresh("screening", "creators"), onError });
  const createDraftMutation = useMutation({ mutationFn: desk.createDraft, onSuccess: () => refresh("drafts"), onError });
  const draftStatusMutation = useMutation({ mutationFn: desk.updateDraftStatus, onSuccess: () => refresh("drafts", "creators"), onError });
  const scheduleFollowupMutation = useMutation({ mutationFn: desk.scheduleFollowup, onSuccess: () => refresh("followups"), onError });
  const createProductBriefMutation = useMutation({ mutationFn: desk.createBrief, onSuccess: () => refresh("briefs"), onError });
  const updateProductBriefMutation = useMutation({ mutationFn: desk.updateBrief, onSuccess: () => refresh("briefs", "creators"), onError });
  const createMarketingPlanMutation = useMutation({ mutationFn: desk.createPlan, onSuccess: () => refresh("plans"), onError });
  const updateMarketingPlanMutation = useMutation({ mutationFn: desk.updatePlan, onSuccess: () => refresh("plans"), onError });
  const createMarketingItemMutation = useMutation({ mutationFn: desk.createItem, onSuccess: () => refresh("items"), onError });
  const updateMarketingItemMutation = useMutation({ mutationFn: desk.updateItem, onSuccess: () => refresh("items"), onError });

  const liveLabel = !configured ? "Key missing" : creatorsQuery.isError ? "Supabase error" : creatorsQuery.data ? "Supabase live" : creatorsQuery.isLoading ? "Connecting" : "Local fallback";

  return {
    configured, liveLabel, creatorsQuery, evidenceQuery, screeningQuery, draftsQuery, followupsQuery,
    productBriefsQuery, marketingPlansQuery, marketingItemsQuery, revenueProductsQuery, revenueTermsQuery, revenueTransactionsQuery,
    addEvidenceMutation, saveScreeningMutation, createDraftMutation, draftStatusMutation, scheduleFollowupMutation,
    createProductBriefMutation, updateProductBriefMutation, createMarketingPlanMutation, updateMarketingPlanMutation,
    createMarketingItemMutation, updateMarketingItemMutation,
  };
}
