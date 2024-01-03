import { Box, Skeleton, Typography, useMediaQuery } from "@mui/material";
import { CreditPositionTab } from "./CreditPositionTab";
import { useState } from "react";
import { XCaliButton } from "components/componentLibrary/Button/XCaliButton";
import {
  useBorrowPositionsFormatted,
  useLentPositionsFormatted,
  useLiquidityPositionsFormatted,
} from "hooks/credit/useUserPositionsFormatted";
import LendPositionCard from "./positionCards/LendPositionCard";
import LiquidityPositionCard from "./positionCards/LiquidityPositionCard";
import { CreditPair } from "types/credit";
import { Due, CreditPool } from "types/credit";
import BorrowPositionCard from "./positionCards/BorrowedPositionCard";
import Card from "components/componentLibrary/Card";
import { Type } from "../Pools";
import { useBorrowedPositions, useLentPositions } from "@functions/credit";
import SubCard from "@components/componentLibrary/Card/SubCard";
import { useLiquidityPositions } from "@functions/liquidity/liquidityPairs";
import { useActiveWeb3React } from "@services/web3/useActiveWeb3React";
import { pairs } from "d3-array";

interface CreditPositionCardProps {
  openModal: (arg: Type) => void;
  creditPair?: CreditPair;
  loading?: boolean;
  maturity: number;
  showActivePools?: boolean;
}

const LoadingCard = () => {
  return (
    <SubCard style={{ height: "300px", padding: "0" }}>
      <Skeleton
        animation="wave"
        variant="rectangular"
        sx={{ borderRadius: "10px" }}
        width="100%"
        height="100%"
      />
    </SubCard>
  );
};

const NoPositions = () => {
  return (
    <Typography variant="body-large-regular" margin="auto">
      You don&apos;t have any positions
    </Typography>
  );
};

export default function CreditPositionsModal({
  openModal,
  creditPair,
  loading,
  maturity,
  showActivePools,
}: CreditPositionCardProps) {
  const { account } = useActiveWeb3React();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { isValidating: isLoadingLentPositions } = useLentPositions();
  const { isValidating: isLoadingBorrowedPositions } = useBorrowedPositions();
  const { isValidating: isLoadingLiqPositions } = useLiquidityPositions();

  const { data: userLent } = useLentPositionsFormatted(
    creditPair?.asset.address,
    creditPair?.collateral.address,
    maturity
  );
  const { data: userBorrowed } = useBorrowPositionsFormatted(
    creditPair?.asset.address,
    creditPair?.collateral.address,
    maturity
  );
  const { data: userLP } = useLiquidityPositionsFormatted(
    creditPair?.asset.address,
    creditPair?.collateral.address,
    maturity
  );

  const borrowedPositions = userBorrowed?.map((position, index) => ({
    ...position?.pool?.creditPositions?.filter(
      (creditPosition: any) => creditPosition?.owner?.id === account
    )[index],
  })) as [];

  const totalPositions = userLent.length + userBorrowed.length + userLP.length;

  const media927 = useMediaQuery("(max-width : 927px)");
  return (
    <Card
      fontSize="m"
      // header={`My Positions: ${totalPositions}`}
      width={media927 ? "100%" : "448px"}
      sx={{ maxWidth: media927 ? "500px" : "100%" }}
      maxHeight="550px"
    >
      <Box display="flex" gap="12px" alignItems="center">
        <Typography fontSize={"16px"} fontWeight="800" color="white">
          My Positions
        </Typography>
        <Box
          padding="0"
          width="25px"
          height="25px"
          borderRadius="3px"
          sx={{ backgroundColor: "white" }}
          display="flex"
          alignItems="center"
          justifyContent={"center"}
        >
          <Typography
            variant="body-moderate-numeric"
            color="black"
            textAlign={"center"}
          >
            {totalPositions}
          </Typography>
        </Box>
      </Box>
      <CreditPositionTab
        labels={[
          `Lend (${userLent?.length || 0})`,
          `Borrow (${userBorrowed?.length || 0})`,
          `LP (${userLP?.length || 0})`,
        ]}
        selectedIndex={selectedIndex}
        setSelected={setSelectedIndex}
      />
      <Box
        height="400px"
        sx={{ overflowY: "auto" }}
        display="flex"
        flexDirection="column"
        gap="24px"
        position="relative"
      >
        {selectedIndex === 0 ? (
          userLent.length ? (
            userLent.map((position, index) => (
              <LendPositionCard
                index={index}
                position={{
                  pair: position?.pair as CreditPair,
                  pool: position?.pool as CreditPool,
                  maturity: position?.pool.maturity as number,
                }}
                key={index}
              />
            ))
          ) : isLoadingLentPositions ? (
            <LoadingCard />
          ) : (
            <NoPositions />
          )
        ) : selectedIndex === 1 ? (
          userBorrowed.length ? (
            userBorrowed.map((position, index) => (
              <BorrowPositionCard
                index={index}
                position={{
                  pair: position?.pair as CreditPair,
                  pool: position?.pool as CreditPool,
                  maturity: position?.pool.maturity as number,
                  due: position?.due as Due,
                  borrowedPositions: borrowedPositions,
                }}
                key={index}
              />
            ))
          ) : isLoadingBorrowedPositions ? (
            <LoadingCard />
          ) : (
            <NoPositions />
          )
        ) : selectedIndex === 2 ? (
          userLP.length ? (
            userLP.map((position, index) => (
              <LiquidityPositionCard
                position={position}
                index={index}
                key={index}
              />
            ))
          ) : isLoadingLiqPositions ? (
            <LoadingCard />
          ) : (
            <NoPositions />
          )
        ) : (
          <></>
        )}
      </Box>
      {selectedIndex === 0 ? (
        <XCaliButton
          variant="blue"
          Component="+ Lend"
          textVariant="body-small-numeric"
          type="filled"
          onClickFn={() => openModal("Lend")}
          disabled={!creditPair || loading || !showActivePools}
          showLoader={loading}
        />
      ) : selectedIndex === 1 ? (
        <XCaliButton
          variant="yellow"
          Component="+ Borrow"
          type="filled"
          onClickFn={() => openModal("Borrow")}
          disabled={!creditPair || loading || !showActivePools}
          showLoader={loading}
        />
      ) : (
        selectedIndex === 2 && (
          <XCaliButton
            variant="pink"
            Component="+ Provide Liquidity"
            type="filled"
            onClickFn={() => openModal("Provide Liquidity")}
            disabled={!creditPair || loading || !showActivePools}
            showLoader={loading}
          />
        )
      )}
    </Card>
  );
}
