// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
/*
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MMM is
    Initializable,
    OwnableUpgradeable,
    ERC20Upgradeable,
    UUPSUpgradeable {

    function initialize() public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
        __ERC20_init("MultiMetaMultiverse", "MMM");
        __MMM_init();       
    }

    function __MMM_init() internal initializer {

      /*  _tTotal = 1000000 * 10**6 * 10**9;
        _rTotal = (MAX - (MAX % _tTotal));
        _maxFee = 1000;

        swapAndLiquifyEnabled = true;

        _maxTxAmount = 5000 * 10**6 * 10**9;
        numTokensSellToAddToLiquidity = 500 * 10**6 * 10**9;

        _burnAddress = 0x000000000000000000000000000000000000dEaD;
        _initializerAccount = _msgSender();

        _rOwned[_initializerAccount] = _rTotal;

        uniswapV2Router = IUniswapV2Router02(_router);
        WBNB = uniswapV2Router.WETH();
        // Create a uniswap pair for this new token
        uniswapV2Pair = IUniswapV2Factory(uniswapV2Router.factory())
        .createPair(address(this), WBNB);

        //exclude owner and this contract from fee
        _isExcludedFromFee[owner()] = true;
        _isExcludedFromFee[address(this)] = true;

        __Safemoon_tiers_init();

        emit Transfer(address(0), _msgSender(), _tTotal);*/
/*}
}*/
